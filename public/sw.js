const CACHE_NAME = "dln-v12";

const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/favicon.png",
  "/pwa-192.png",
  "/pwa-512.png",
  "/pwa-512-maskable.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      for (const url of APP_SHELL) {
        try {
          await cache.add(url);
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
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  /*
   * Navigation
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
   * JS / CSS / images / fonts / other same-origin assets
   *
   * CACHE FIRST.
   */
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