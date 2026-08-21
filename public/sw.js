const CACHE_NAME = "dln-v8";

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

      // Cache the basic app shell.
      for (const url of APP_SHELL) {
        try {
          await cache.add(url);
        } catch (error) {
          console.warn("PWA shell cache failed:", url, error);
        }
      }

      // Read index.html and cache all Vite-generated JS/CSS assets.
      try {
        const response = await fetch("/");

        if (response.ok) {
          const html = await response.text();

          const assets = [
            ...html.matchAll(
              /(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/g
            ),
          ].map((match) => match[1]);

          for (const asset of [...new Set(assets)]) {
            try {
              await cache.add(asset);
              console.log("PWA cached asset:", asset);
            } catch (error) {
              console.warn(
                "PWA asset cache failed:",
                asset,
                error
              );
            }
          }

          await cache.put(
            "/",
            new Response(html, {
              headers: {
                "Content-Type": "text/html",
              },
            })
          );
        }
      } catch (error) {
        console.warn("PWA asset discovery failed:", error);
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

  // Navigation requests.
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
        } catch {
          const cached = await caches.match("/");

          if (cached) {
            return cached;
          }

          return new Response(
            `<!doctype html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Dress Like Nawaabs</title>
              </head>
              <body>
                <h1>Dress Like Nawaabs</h1>
                <p>You are currently offline.</p>
              </body>
            </html>`,
            {
              headers: {
                "Content-Type": "text/html",
              },
            }
          );
        }
      })()
    );

    return;
  }

  // Assets and other same-origin GET requests.
  event.respondWith(
  (async () => {
    const cached = await caches.match(event.request);

    try {
      const response = await fetch(event.request);

      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, response.clone());
      }

      return response;
    } catch {
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
});