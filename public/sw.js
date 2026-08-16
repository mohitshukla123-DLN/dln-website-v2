const CACHE_NAME = "dln-v4";

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
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_SHELL)
    )
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
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

  // Navigation requests:
  // Network first, cached app shell when offline.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put("/", copy);
            });
          }

          return response;
        })
        .catch(async () => {
          const cachedShell = await caches.match("/");

          if (cachedShell) {
            return cachedShell;
          }

          return new Response(
            `
              <!doctype html>
              <html>
                <head>
                  <title>Dress Like Nawaabs</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body>
                  <h1>Dress Like Nawaabs</h1>
                  <p>You are currently offline.</p>
                  <p>Please reconnect to continue browsing.</p>
                  <a href="/">Go to Home</a>
                </body>
              </html>
            `,
            {
              headers: {
                "Content-Type": "text/html",
              },
            }
          );
        })
    );

    return;
  }

  // Cache same-origin application assets after they are requested.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
            });
          }

          return response;
        })
        .catch(() => {
          return new Response("", {
            status: 503,
            statusText: "Offline",
          });
        });
    })
  );
});