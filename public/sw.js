const CACHE_NAME = "dln-v16";
const API_CACHE_NAME = "dln-api-v2";
const FONT_CACHE_NAME = "dln-fonts-v1";
const IMAGE_CACHE_NAME = "dln-images-v2";

importScripts("/sw-assets.js");

const SW_ASSETS = self.__SW_ASSETS__ || [];

const SUPABASE_ORIGIN =
  "https://wcbuhcjjcofvuxokduyh.supabase.co";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/favicon.png",
  "/pwa-192.png",
  "/pwa-512.png",
  "/pwa-512-maskable.png",
];

const IMAGE_EXTENSIONS =
  /\.(png|jpe?g|webp|gif|svg|avif)$/i;

const VIDEO_EXTENSIONS =
  /\.(mp4|webm|mov|m4v|ogg)$/i;

/*
 * ---------------------------------------------------------
 * INSTALL
 * ---------------------------------------------------------
 */

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      /*
       * Cache PWA shell.
       */
      for (const url of APP_SHELL) {
        try {
          const response = await fetch(url, {
            cache: "no-store",
          });

          if (response.ok) {
            await cache.put(url, response.clone());
            console.log("PWA shell cached:", url);
          }
        } catch (error) {
          console.warn(
            "PWA shell cache failed:",
            url,
            error
          );
        }
      }

      /*
       * Cache Vite-generated JS/CSS/assets.
       */
      for (const url of SW_ASSETS) {
        try {
          const response = await fetch(url, {
            cache: "no-store",
          });

          if (response.ok) {
            await cache.put(url, response.clone());
            console.log("PWA asset cached:", url);
          }
        } catch (error) {
          console.warn(
            "PWA asset cache failed:",
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
      const keep = new Set([
        CACHE_NAME,
        API_CACHE_NAME,
        FONT_CACHE_NAME,
        IMAGE_CACHE_NAME,
      ]);

      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter((key) => !keep.has(key))
          .map((key) => {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          })
      );

      await self.clients.claim();

      console.log(
        "Service Worker activated:",
        CACHE_NAME
      );
    })()
  );
});

/*
 * ---------------------------------------------------------
 * HELPERS
 * ---------------------------------------------------------
 */

function isSupabase(request) {
  return request.url.startsWith(
    SUPABASE_ORIGIN
  );
}

function isSupabaseImage(request) {
  if (!isSupabase(request)) {
    return false;
  }

  const url = new URL(request.url);

  return (
    url.pathname.includes(
      "/storage/v1/object/public/"
    ) ||
    IMAGE_EXTENSIONS.test(url.pathname)
  );
}

function isVideo(request) {
  const url = new URL(request.url);

  return (
    VIDEO_EXTENSIONS.test(url.pathname) ||
    request.destination === "video"
  );
}

function isFont(request) {
  const url = new URL(request.url);

  return (
    request.destination === "font" ||
    /\.(woff2?|ttf|otf|eot)$/i.test(
      url.pathname
    )
  );
}

function isApiRequest(request) {
  return (
    isSupabase(request) &&
    request.url.includes("/rest/v1/")
  );
}

function isNavigation(request) {
  return request.mode === "navigate";
}

/*
 * ---------------------------------------------------------
 * NAVIGATION
 *
 * Network first.
 *
 * Offline:
 *   1. Exact cached route
 *   2. Cached index.html
 *   3. Cached /
 *   4. Offline fallback
 * ---------------------------------------------------------
 */

async function handleNavigation(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);

      /*
       * Cache the requested HTML route.
       */
      try {
        await cache.put(
          request,
          response.clone()
        );
      } catch (error) {
        console.warn(
          "Navigation cache failed:",
          request.url,
          error
        );
      }

      /*
       * Keep the actual application shell as "/".
       *
       * IMPORTANT:
       * Do not overwrite "/" with arbitrary route HTML.
       */
      if (
        request.url ===
        new URL("/", self.location.origin).href
      ) {
        try {
          await cache.put(
            "/",
            response.clone()
          );
        } catch (error) {
          console.warn(
            "Root cache failed:",
            error
          );
        }
      }
    }

    return response;
  } catch (error) {
    console.warn(
      "Offline navigation:",
      request.url
    );

    /*
     * 1. Exact route.
     */
    const exact = await caches.match(request);

    if (exact) {
      return exact;
    }

    /*
     * 2. index.html.
     */
    const index = await caches.match(
      "/index.html"
    );

    if (index) {
      return index;
    }

    /*
     * 3. Root.
     */
    const root = await caches.match("/");

    if (root) {
      return root;
    }

    /*
     * 4. Last-resort HTML.
     */
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
}

/*
 * ---------------------------------------------------------
 * IMAGES
 *
 * Cache first.
 *
 * Supabase public Storage responses may be "opaque"
 * because they are cross-origin.
 *
 * Opaque responses ARE intentionally cached here.
 * This is required for reliable offline public images.
 * ---------------------------------------------------------
 */

async function handleImage(request) {
  const cache = await caches.open(
    IMAGE_CACHE_NAME
  );

  /*
   * 1. Cache first.
   */
  const cached = await cache.match(request);

  if (cached) {
    console.log(
      "Image served from cache:",
      request.url
    );

    return cached;
  }

  /*
   * 2. Network.
   */
  try {
    const response = await fetch(request);

    /*
     * Cache:
     *
     * - normal successful responses
     * - opaque Supabase public Storage responses
     *
     * Do NOT require response.type === "basic".
     */
    const shouldCache =
      response.ok ||
      response.type === "opaque";

    if (shouldCache) {
      try {
        await cache.put(
          request,
          response.clone()
        );

        console.log(
          "Image cached:",
          request.url,
          "type:",
          response.type,
          "status:",
          response.status
        );
      } catch (cacheError) {
        console.warn(
          "Image cache write failed:",
          request.url,
          cacheError
        );
      }
    } else {
      console.warn(
        "Image NOT cached:",
        request.url,
        "type:",
        response.type,
        "status:",
        response.status
      );
    }

    return response;
  } catch (error) {
    console.warn(
      "Image network failed:",
      request.url
    );

    /*
     * Usually the cache-first check above already
     * handles this, but keep a final fallback.
     */
    const fallback = await cache.match(request);

    if (fallback) {
      return fallback;
    }

    /*
     * Return a clean offline response instead of
     * throwing an unhandled fetch error.
     */
    return new Response("", {
      status: 503,
      statusText: "Offline image unavailable",
    });
  }
}

/*
 * ---------------------------------------------------------
 * FONTS
 *
 * Cache first.
 * ---------------------------------------------------------
 */

async function handleFont(request) {
  const cache = await caches.open(
    FONT_CACHE_NAME
  );

  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      try {
        await cache.put(
          request,
          response.clone()
        );
      } catch (error) {
        console.warn(
          "Font cache write failed:",
          request.url,
          error
        );
      }
    }

    return response;
  } catch (error) {
    console.warn(
      "Offline font unavailable:",
      request.url
    );

    return new Response("", {
      status: 503,
      statusText:
        "Offline font unavailable",
    });
  }
}

/*
 * ---------------------------------------------------------
 * SUPABASE API
 *
 * GET:
 *   Network first
 *   Cached response when offline
 *
 * Non-GET:
 *   Never intercepted/cached here because the fetch
 *   handler ignores non-GET requests.
 * ---------------------------------------------------------
 */

async function handleApi(request) {
  const cache = await caches.open(
    API_CACHE_NAME
  );

  try {
    const response = await fetch(request);

    if (
      response.ok &&
      request.method === "GET"
    ) {
      try {
        await cache.put(
          request,
          response.clone()
        );

        console.log(
          "Supabase API cached:",
          request.url
        );
      } catch (cacheError) {
        console.warn(
          "Supabase API cache write failed:",
          request.url,
          cacheError
        );
      }
    }

    return response;
  } catch (error) {
    const cached = await cache.match(request);

    if (cached) {
      console.warn(
        "Supabase offline, using API cache:",
        request.url
      );

      return cached;
    }

    console.warn(
      "Supabase API unavailable:",
      request.url
    );

    return new Response(
      JSON.stringify({
        offline: true,
        data: null,
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
}

/*
 * ---------------------------------------------------------
 * VIDEO
 *
 * Never cache videos.
 *
 * This avoids:
 * - huge Cache Storage usage
 * - Range request problems
 * - partially cached videos
 * ---------------------------------------------------------
 */

async function handleVideo(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response("", {
      status: 503,
      statusText:
        "Offline video unavailable",
    });
  }
}

/*
 * ---------------------------------------------------------
 * SAME-ORIGIN ASSETS
 *
 * Cache first.
 * ---------------------------------------------------------
 */

async function handleAsset(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(
        CACHE_NAME
      );

      try {
        await cache.put(
          request,
          response.clone()
        );
      } catch (error) {
        console.warn(
          "Asset cache failed:",
          request.url,
          error
        );
      }
    }

    return response;
  } catch (error) {
    console.warn(
      "Offline asset unavailable:",
      request.url
    );

    return new Response("", {
      status: 503,
      statusText:
        "Offline asset unavailable",
    });
  }
}

/*
 * ---------------------------------------------------------
 * FETCH
 * ---------------------------------------------------------
 */

self.addEventListener("fetch", (event) => {
  const request = event.request;

  /*
   * Only GET requests.
   */
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  /*
   * Ignore unrelated cross-origin requests.
   *
   * Only:
   * - same-origin
   * - Supabase
   */
  if (
    url.origin !== self.location.origin &&
    url.origin !== SUPABASE_ORIGIN
  ) {
    return;
  }

  /*
   * Navigation.
   */
  if (isNavigation(request)) {
    event.respondWith(
      handleNavigation(request)
    );

    return;
  }

  /*
   * Supabase public Storage images.
   *
   * This MUST come before generic same-origin
   * asset handling.
   */
  if (isSupabaseImage(request)) {
    event.respondWith(
      handleImage(request)
    );

    return;
  }

  /*
   * Fonts.
   */
  if (isFont(request)) {
    event.respondWith(
      handleFont(request)
    );

    return;
  }

  /*
   * Supabase REST API.
   */
  if (isApiRequest(request)) {
    event.respondWith(
      handleApi(request)
    );

    return;
  }

  /*
   * Videos.
   */
  if (isVideo(request)) {
    event.respondWith(
      handleVideo(request)
    );

    return;
  }

  /*
   * Same-origin assets.
   */
  if (url.origin === self.location.origin) {
    event.respondWith(
      handleAsset(request)
    );
  }
});