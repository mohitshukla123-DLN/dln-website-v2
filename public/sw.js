const CACHE_NAME = "dln-v9";

const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/favicon.png",
  "/pwa-192.png",
  "/pwa-512.png",
  "/pwa-512-maskable.png",
];

async function cacheAppAssets(cache) {
  // Cache the basic shell.
  for (const url of APP_SHELL) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
      });

      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.warn("PWA shell cache failed:", url, error);
    }
  }

  // Get the current HTML and discover Vite assets.
  try {
    const response = await fetch("/", {
      cache: "no-store",
    });

    if (!response.ok) return;

    const html = await response.text();

    const assets = [
      ...html.matchAll(
        /(?:src|href)="(\/assets\/[^"]+\.(?:js|css|png|jpg|jpeg|webp|svg))"/g
      ),
    ].map((match) => match[1]);

    for (const asset of [...new Set(assets)]) {
      try {
        const assetResponse = await fetch(asset, {
          cache: "no-store",
        });

        if (assetResponse.ok) {
          await cache.put(asset, assetResponse);
          console.log("PWA cached:", asset);
        }
      } catch (error) {
        console.warn("PWA asset cache failed:", asset, error);
      }
    }

    // Store the HTML itself.
    await cache.put(
      "/",
      new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
        },
      })
    );
  } catch (error) {
    console.warn("PWA asset discovery failed:", error);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cacheAppAssets(cache);
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
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Only handle this website.
  if (url.origin !== self.location.origin) return;

  // Navigation / HTML.
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
              status: 200,
              headers: {
                "Content-Type": "text/html; charset=UTF-8",
              },
            }
          );
        }
      })()
    );

    return;
  }

  // Only cache static application assets.
  const isStaticAsset =
    url.pathname.startsWith("/assets/") ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/favicon.png" ||
    url.pathname.startsWith("/pwa-");

  if (!isStaticAsset) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);

        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, response.clone());
        }

        return response;
      } catch {
        const cached = await caches.match(event.request);

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