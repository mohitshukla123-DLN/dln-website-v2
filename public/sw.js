const CACHE_NAME = "dln-v12";
const API_CACHE_NAME = "dln-api-v1";
const FONT_CACHE_NAME = "dln-fonts-v1";
const IMAGE_CACHE_NAME = "dln-images-v1";

const SUPABASE_ORIGIN =
  "https://wcbuhcjjcofvuxokduyh.supabase.co";

const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/favicon.png",
  "/pwa-192.png",
  "/pwa-512.png",
  "/pwa-512-maskable.png",
];

/*
 * ---------------------------------------------------------
 * INSTALL
 * ---------------------------------------------------------
 */

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      for (const url of APP_SHELL) {
        try {
          await cache.add(url);
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

/*
 * ---------------------------------------------------------
 * ACTIVATE
 * ---------------------------------------------------------
 */

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
              key !== FONT_CACHE_NAME &&
              key !== IMAGE_CACHE_NAME
          )
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

/*
 * ---------------------------------------------------------
 * HELPERS
 * ---------------------------------------------------------
 */

function isSupabaseRequest(url) {
  return url.origin === SUPABASE_ORIGIN;
}

function isSupabaseStorageImage(url) {
  if (!isSupabaseRequest(url)) {
    return false;
  }

  return (
    url.pathname.startsWith(
      "/storage/v1/object/public/"
    ) &&
    /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(
      url.pathname
    )
  );
}

function isSupabaseApiRequest(url) {
  return (
    isSupabaseRequest(url) &&
    url.pathname.startsWith("/rest/v1/")
  );
}

function isFontRequest(request) {
  const url = new URL(request.url);

  return (
    url.origin === self.location.origin &&
    /\.(woff2?|ttf|otf)$/i.test(url.pathname)
  );
}

/*
 * ---------------------------------------------------------
 * FETCH
 * ---------------------------------------------------------
 */

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  /*
   * -------------------------------------------------------
   * NAVIGATION
   * -------------------------------------------------------
   */

  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(event.request);

          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);

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

  /*
   * -------------------------------------------------------
   * SUPABASE STORAGE IMAGES
   *
   * CACHE FIRST
   * -------------------------------------------------------
   */

  if (isSupabaseStorageImage(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(
          IMAGE_CACHE_NAME
        );

        const cached = await cache.match(
          event.request
        );

        if (cached) {
          console.log(
            "Supabase image from cache:",
            event.request.url
          );

          return cached;
        }

        try {
          const response = await fetch(
            event.request
          );

          if (response.ok || response.type === "opaque") {
            try {
              await cache.put(
                event.request,
                response.clone()
              );

              console.log(
                "Supabase image cached:",
                event.request.url
              );
            } catch (cacheError) {
              console.warn(
                "Supabase image cache failed:",
                event.request.url,
                cacheError
              );
            }
          }

          return response;
        } catch (error) {
          console.warn(
            "Supabase image unavailable offline:",
            event.request.url,
            error
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

  /*
   * -------------------------------------------------------
   * SUPABASE REST API
   *
   * NETWORK FIRST
   * FALL BACK TO API CACHE
   * -------------------------------------------------------
   */

  if (isSupabaseApiRequest(url)) {
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
                "Supabase API cached:",
                event.request.url
              );
            } catch (cacheError) {
              console.warn(
                "Supabase API cache failed:",
                event.request.url,
                cacheError
              );
            }
          }

          return response;
        } catch (error) {
          const cached = await cache.match(
            event.request
          );

          if (cached) {
            console.log(
              "Supabase offline, using API cache:",
              event.request.url
            );

            return cached;
          }

          console.warn(
            "Supabase API unavailable offline:",
            event.request.url
          );

          return new Response(
            JSON.stringify([]),
            {
              status: 503,
              statusText: "Offline",
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

  /*
   * -------------------------------------------------------
   * FONTS
   * -------------------------------------------------------
   */

  if (isFontRequest(event.request)) {
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

          if (response.ok) {
            await cache.put(
              event.request,
              response.clone()
            );
          }

          return response;
        } catch (error) {
          console.warn(
            "Font unavailable offline:",
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

  /*
   * -------------------------------------------------------
   * SAME-ORIGIN ASSETS
   *
   * CACHE FIRST
   * -------------------------------------------------------
   */

  if (url.origin !== self.location.origin) {
    return;
  }

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