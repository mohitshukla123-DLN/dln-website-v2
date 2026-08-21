const CACHE_NAME = "dln-v12";
const API_CACHE_NAME = "dln-api-v1";
const FONT_CACHE_NAME = "dln-fonts-v1";

const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/favicon.png",
  "/pwa-192.png",
  "/pwa-512.png",
  "/pwa-512-maskable.png",
];

const FONT_HOSTS = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
];

const API_HOSTS = [
  "wcbuhcjjcofvuxokduyh.supabase.co",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      for (const url of APP_SHELL) {
        try {
          const response = await fetch(url);

          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (error) {
          console.warn("PWA shell cache failed:", url, error);
        }
      }
    })()
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter(
            (key) =>
              key !== CACHE_NAME &&
              key !== API_CACHE_NAME &&
              key !== FONT_CACHE_NAME
          )
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  /*
   * ---------------------------------------------------------
   * 1. NAVIGATION
   * ---------------------------------------------------------
   */

  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(event.request);

          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);

            await cache.put("/", response.clone());
          }

          return response;
        } catch (error) {
          console.warn("Offline navigation:", error);

          const cached = await caches.match("/");

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
                "Content-Type": "text/html; charset=utf-8",
              },
            }
          );
        }
      })()
    );

    return;
  }

  /*
   * ---------------------------------------------------------
   * 2. SUPABASE API
   * ---------------------------------------------------------
   *
   * Network first:
   *   - Online  -> get fresh Supabase data
   *   - Success -> update API cache
   *   - Offline -> return cached API response
   */

  if (API_HOSTS.includes(url.hostname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(API_CACHE_NAME);

        try {
          const response = await fetch(event.request);

          if (response.ok) {
            await cache.put(
              event.request,
              response.clone()
            );
          }

          return response;
        } catch (error) {
          console.warn(
            "Supabase offline, using API cache:",
            event.request.url
          );

          const cached = await cache.match(event.request);

          if (cached) {
            return cached;
          }

          return new Response(
            JSON.stringify({
              error: "offline",
              message: "No cached data available.",
            }),
            {
              status: 503,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      })()
    );

    return;
  }

  /*
   * ---------------------------------------------------------
   * 3. GOOGLE FONTS
   * ---------------------------------------------------------
   *
   * Network first with font-specific cache.
   */

  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(FONT_CACHE_NAME);

        try {
          const response = await fetch(event.request);

          if (response.ok) {
            await cache.put(
              event.request,
              response.clone()
            );
          }

          return response;
        } catch (error) {
          console.warn(
            "Font offline, using font cache:",
            event.request.url
          );

          const cached = await cache.match(event.request);

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

  /*
   * ---------------------------------------------------------
   * 4. SAME-ORIGIN STATIC ASSETS
   * ---------------------------------------------------------
   *
   * Cache first.
   */

  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(event.request);

        if (cached) {
          return cached;
        }

        try {
          const response = await fetch(event.request);

          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);

            await cache.put(
              event.request,
              response.clone()
            );

            console.log(
              "PWA cached:",
              event.request.url
            );
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

    return;
  }
});