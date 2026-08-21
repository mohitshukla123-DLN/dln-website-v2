const CACHE_NAME = "dln-v12";
const API_CACHE_NAME = "dln-api-v1";
const FONT_CACHE_NAME = "dln-fonts-v1";

const SUPABASE_ORIGIN =
  "https://wcbuhcjjcofvuxokduyh.supabase.co";

const GOOGLE_FONTS_ORIGINS = [
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];

const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/favicon.png",
  "/pwa-192.png",
  "/pwa-512.png",
  "/pwa-512-maskable.png",
];

/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      for (const url of APP_SHELL) {
        try {
          await cache.add(url);
          console.log("PWA shell cached:", url);
        } catch (error) {
          console.warn(
            "PWA shell cache failed:",
            url,
            error
          );
        }
      }
    })()
  );

  self.skipWaiting();
});

/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      const keepCaches = [
        CACHE_NAME,
        API_CACHE_NAME,
        FONT_CACHE_NAME,
      ];

      await Promise.all(
        keys
          .filter((key) => !keepCaches.includes(key))
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();

      console.log("PWA Service Worker activated");
    })()
  );
});

/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  /* =======================================================
     1. SUPABASE API

     NETWORK FIRST

     Online:
       Network → cache response

     Offline:
       Network fails → cached response
     ======================================================= */

  if (
    url.origin === SUPABASE_ORIGIN &&
    url.pathname.startsWith("/rest/v1/")
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(
          API_CACHE_NAME
        );

        try {
          const response = await fetch(
            event.request
          );

          if (response.ok) {
            try {
              await cache.put(
                event.request,
                response.clone()
              );

              console.log(
                "PWA API cached:",
                event.request.url
              );
            } catch (cacheError) {
              console.warn(
                "PWA API cache failed:",
                event.request.url,
                cacheError
              );
            }
          }

          return response;
        } catch (error) {
          console.warn(
            "Offline Supabase request:",
            event.request.url
          );

          const cached = await cache.match(
            event.request
          );

          if (cached) {
            console.log(
              "PWA API served from cache:",
              event.request.url
            );

            return cached;
          }

          return new Response(
            JSON.stringify({
              error: "offline",
              message:
                "No cached data is available for this request.",
            }),
            {
              status: 503,
              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          );
        }
      })()
    );

    return;
  }

  /* =======================================================
     2. GOOGLE FONTS

     CACHE FIRST
     ======================================================= */

  if (
    GOOGLE_FONTS_ORIGINS.includes(url.origin)
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(
          FONT_CACHE_NAME
        );

        const cached = await cache.match(
          event.request
        );

        if (cached) {
          return cached;
        }

        try {
          const response = await fetch(
            event.request
          );

          if (
            response.ok ||
            response.type === "opaque"
          ) {
            try {
              await cache.put(
                event.request,
                response.clone()
              );

              console.log(
                "PWA font cached:",
                event.request.url
              );
            } catch (cacheError) {
              console.warn(
                "PWA font cache failed:",
                event.request.url,
                cacheError
              );
            }
          }

          return response;
        } catch (error) {
          console.warn(
            "Offline font unavailable:",
            event.request.url
          );

          const cached = await cache.match(
            event.request
          );

          if (cached) {
            return cached;
          }

          return new Response("", {
            status: 503,
            statusText: "Offline",
          });
        }
      })()
    );

    return;
  }

  /* =======================================================
     3. OTHER CROSS-ORIGIN REQUESTS

     Do NOT intercept:
       - Google Analytics
       - Google Tag Manager
       - Microsoft Clarity
       - other third-party services
     ======================================================= */

  if (url.origin !== self.location.origin) {
    return;
  }

  /* =======================================================
     4. NAVIGATION

     Network first → cached "/" fallback
     ======================================================= */

  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(
            event.request
          );

          if (response.ok) {
            const cache = await caches.open(
              CACHE_NAME
            );

            await cache.put(
              "/",
              response.clone()
            );
          }

          return response;
        } catch (error) {
          console.warn(
            "Offline navigation:",
            error
          );

          const cached = await caches.match(
            "/"
          );

          if (cached) {
            return cached;
          }

          return new Response(
            `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dress Like Nawaabs</title>
</head>
<body>
<h1>Dress Like Nawaabs</h1>
<p>You are currently offline.</p>
</body>
</html>`,
            {
              status: 200,
              headers: {
                "Content-Type":
                  "text/html; charset=utf-8",
              },
            }
          );
        }
      })()
    );

    return;
  }

  /* =======================================================
     5. SAME-ORIGIN ASSETS

     CACHE FIRST

     JS / CSS / images / local fonts / etc.
     ======================================================= */

  event.respondWith(
    (async () => {
      const cached = await caches.match(
        event.request
      );

      if (cached) {
        return cached;
      }

      try {
        const response = await fetch(
          event.request
        );

        if (response.ok) {
          const cache = await caches.open(
            CACHE_NAME
          );

          try {
            await cache.put(
              event.request,
              response.clone()
            );

            console.log(
              "PWA cached:",
              event.request.url
            );
          } catch (cacheError) {
            console.warn(
              "PWA cache put failed:",
              event.request.url,
              cacheError
            );
          }
        }

        return response;
      } catch (error) {
        console.warn(
          "PWA offline asset unavailable:",
          event.request.url
        );

        return new Response("", {
          status: 503,
          statusText: "Offline",
        });
      }
    })()
  );
});