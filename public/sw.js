const CACHE_NAME = "dln-v15";
const API_CACHE_NAME = "dln-api-v1";
const FONT_CACHE_NAME = "dln-fonts-v1";
const IMAGE_CACHE_NAME = "dln-images-v1";

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

      // Cache the PWA shell
      for (const url of APP_SHELL) {
        try {
          const response = await fetch(url, {
            cache: "no-store",
          });

          if (response.ok) {
            await cache.put(url, response);
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

      // Cache all Vite-generated JS/CSS/assets
      for (const url of SW_ASSETS) {
        try {
          const response = await fetch(url, {
            cache: "no-store",
          });

          if (response.ok) {
            await cache.put(url, response);
            console.log(
              "PWA asset cached:",
              url
            );
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
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter(
            (key) =>
              ![
                CACHE_NAME,
                API_CACHE_NAME,
                FONT_CACHE_NAME,
                IMAGE_CACHE_NAME,
              ].includes(key)
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

function isSupabase(request) {
  return request.url.startsWith(
    SUPABASE_ORIGIN
  );
}

function isSupabaseImage(request) {
  if (!isSupabase(request)) {
    return false;
  }

  return (
    request.url.includes(
      "/storage/v1/object/public/"
    ) ||
    IMAGE_EXTENSIONS.test(
      new URL(request.url).pathname
    )
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
 * Online:
 *   network first
 *
 * Offline:
 *   cached SPA shell
 * ---------------------------------------------------------
 */

async function handleNavigation(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(
        CACHE_NAME
      );

      await cache.put(
        request,
        response.clone()
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
      request.url
    );

    const exact = await caches.match(
      request
    );

    if (exact) {
      return exact;
    }

    const root = await caches.match("/");

    if (root) {
      return root;
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
}

/*
 * ---------------------------------------------------------
 * IMAGES
 *
 * Cache first.
 *
 * IMPORTANT:
 * Supabase cross-origin images are commonly
 * returned as opaque responses:
 *
 *   response.type === "opaque"
 *   response.ok === false
 *   response.status === 0
 *
 * Opaque responses are still valid for <img>
 * and MUST be allowed into Cache Storage.
 * ---------------------------------------------------------
 */

async function handleImage(request) {
  const cache = await caches.open(
    IMAGE_CACHE_NAME
  );

  // 1. Cache first
  const cached = await cache.match(request);

  if (cached) {
    console.log(
      "Image served from cache:",
      request.url
    );

    return cached;
  }

  // 2. Network
  try {
    const response = await fetch(request);

    /*
     * Cache both:
     *
     * 1. Normal successful responses
     * 2. Opaque Supabase responses
     */
    const cacheable =
      response.ok ||
      response.type === "opaque";

    if (cacheable) {
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
        /*
         * Never break an online image just
         * because Cache Storage failed.
         */
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
      request.url,
      error
    );

    /*
     * Try cache again in case another request
     * populated it while this request was running.
     */
    const fallback = await cache.match(
      request
    );

    if (fallback) {
      console.log(
        "Offline image served from cache:",
        request.url
      );

      return fallback;
    }

    throw error;
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
          "Font cache failed:",
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
 * API
 *
 * Network first.
 * Cached API response when offline.
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
          "Supabase API cache failed:",
          request.url,
          cacheError
        );
      }
    }

    return response;
  } catch (error) {
    const cached = await cache.match(
      request
    );

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
 * Do NOT aggressively cache videos.
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
 * OTHER SAME-ORIGIN ASSETS
 *
 * Cache first.
 * ---------------------------------------------------------
 */

async function handleAsset(request) {
  const cached = await caches.match(
    request
  );

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

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  /*
   * Ignore cross-origin requests except Supabase.
   */
  if (
    url.origin !== self.location.origin &&
    url.origin !== SUPABASE_ORIGIN
  ) {
    return;
  }

  /*
   * Navigation
   */
  if (isNavigation(request)) {
    event.respondWith(
      handleNavigation(request)
    );

    return;
  }

  /*
   * Supabase images
   */
  if (isSupabaseImage(request)) {
    event.respondWith(
      handleImage(request)
    );

    return;
  }

  /*
   * Fonts
   */
  if (isFont(request)) {
    event.respondWith(
      handleFont(request)
    );

    return;
  }

  /*
   * Supabase API
   */
  if (isApiRequest(request)) {
    event.respondWith(
      handleApi(request)
    );

    return;
  }

  /*
   * Videos
   */
  if (isVideo(request)) {
    event.respondWith(
      handleVideo(request)
    );

    return;
  }

  /*
   * Same-origin assets
   */
  if (
    url.origin === self.location.origin
  ) {
    event.respondWith(
      handleAsset(request)
    );
  }
});