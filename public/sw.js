const CACHE_NAME = "dln-v10";

const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
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
   * HTML/navigation:
   * Network first.
   * Cached homepage when offline.
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
   * JS/CSS/images/fonts/etc:
   *
   * Cache first.
   * If not cached, use network.
   * Successful network responses are cached.
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
            await cache.put(event.request, response.clone());
          } catch (error) {
            console.warn(
              "PWA cache put failed:",
              event.request.url,
              error
            );
          }
        }

        return response;
      } catch (error) {
        console.warn(
          "PWA fetch failed:",
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
});