const CACHE_NAME = "dln-v20";
const API_CACHE_NAME = "dln-api-v2";
const FONT_CACHE_NAME = "dln-fonts-v2";
const IMAGE_CACHE_NAME = "dln-images-v2";

importScripts("/sw-assets.js");

const SW_ASSETS = self.__SW_ASSETS__ || [];

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

const IMAGE_EXTENSIONS =
  /\.(png|jpe?g|webp|gif|svg|avif)$/i;

const VIDEO_EXTENSIONS =
  /\.(mp4|webm|mov|m4v|ogg)$/i;

const FONT_EXTENSIONS =
  /\.(woff2?|ttf|otf|eot)$/i;

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
       * Cache application shell.
       */

      for (const url of APP_SHELL) {
        try {
          const response = await fetch(url, {
            cache: "no-store",
            redirect: "follow",
          });

          if (response.ok) {
            await cache.put(url, response.clone());

            console.log(
              "PWA shell cached:",
              url
            );
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
            redirect: "follow",
          });

          if (response.ok) {
            await cache.put(
              url,
              response.clone()
            );

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
            console.log(
              "Deleting old cache:",
              key
            );

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
    FONT_EXTENSIONS.test(url.pathname)
  );
}

function isApiRequest(request) {
  return (
    isSupabase(request) &&
    request.url.includes("/rest/v1/")
  );
}

/*
 * IMPORTANT:
 *
 * A normal browser page load should have:
 *
 *   request.mode === "navigate"
 *
 * But some requests can reach the Service Worker as
 * document/HTML requests without mode === "navigate".
 *
 * We therefore check:
 *
 *   1. navigate mode
 *   2. document destination
 *   3. Accept: text/html
 *
 * This prevents /products/jacket and /category/jacket
 * from incorrectly going to handleAsset().
 */

function isNavigation(request) {
  if (request.mode === "navigate") {
    return true;
  }

  if (request.destination === "document") {
    return true;
  }

  const accept = request.headers.get("accept") || "";

  return accept.includes("text/html");
}

/*
 * ---------------------------------------------------------
 * NAVIGATION
 *
 * Network first.
 *
 * Offline:
 *
 *   1. Exact cached route
 *   2. Cached pathname
 *   3. Cached index.html
 *   4. Cached /
 *   5. Offline fallback
 * ---------------------------------------------------------
 */

async function handleNavigation(request) {
  /*
   * NETWORK FIRST
   */

  try {
    const response = await fetch(request, {
      redirect: "follow",
    });

    if (response.ok) {
      const cache = await caches.open(
        CACHE_NAME
      );

      /*
       * Cache exact request.
       */

      try {
        await cache.put(
          request,
          response.clone()
        );

        console.log(
          "Navigation cached:",
          request.url
        );
      } catch (error) {
        console.warn(
          "Navigation cache failed:",
          request.url,
          error
        );
      }

      /*
       * Cache pathname without query string.
       */

      try {
        const url = new URL(
          request.url
        );

        const pathnameRequest =
          new Request(
            url.pathname,
            {
              method: "GET",
            }
          );

        await cache.put(
          pathnameRequest,
          response.clone()
        );

        console.log(
          "Navigation pathname cached:",
          url.pathname
        );
      } catch (error) {
        console.warn(
          "Pathname navigation cache failed:",
          request.url,
          error
        );
      }

      /*
       * Keep "/" as application shell.
       */

      if (
        request.url ===
        new URL(
          "/",
          self.location.origin
        ).href
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

    const cache = await caches.open(
      CACHE_NAME
    );

    /*
     * -------------------------------------------------------
     * 1. EXACT REQUEST
     * -------------------------------------------------------
     */

    const exact = await cache.match(
      request
    );

    if (exact) {
      console.log(
        "Navigation served from exact cache:",
        request.url
      );

      return exact;
    }

    /*
     * -------------------------------------------------------
     * 2. PATHNAME
     * -------------------------------------------------------
     */

    try {
      const url = new URL(
        request.url
      );

      const pathnameRequest =
        new Request(
          url.pathname,
          {
            method: "GET",
          }
        );

      const pathnameCache =
        await cache.match(
          pathnameRequest
        );

      if (pathnameCache) {
        console.log(
          "Navigation served from pathname cache:",
          url.pathname
        );

        return pathnameCache;
      }
    } catch (error) {
      console.warn(
        "Pathname cache lookup failed:",
        request.url,
        error
      );
    }

    /*
     * -------------------------------------------------------
     * 3. INDEX.HTML
     * -------------------------------------------------------
     */

    // 3. ROOT — canonical Cloudflare Pages application shell
const root = await cache.match("/");

if (root) {
  console.log(
    "Navigation served from root"
  );

  return root;
}

// 4. INDEX.HTML — secondary fallback
const index = await cache.match(
  "/index.html"
);

if (index) {
  console.log(
    "Navigation served from index.html"
  );

  return index;
}

    /*
     * -------------------------------------------------------
     * 5. OFFLINE FALLBACK
     * -------------------------------------------------------
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
 * Query parameters are ignored.
 * ---------------------------------------------------------
 */

async function handleImage(request) {
  const cache = await caches.open(
    IMAGE_CACHE_NAME
  );

  /*
   * CACHE FIRST
   */

  const cached = await cache.match(
    request,
    {
      ignoreSearch: true,
    }
  );

  if (cached) {
    console.log(
      "Image served from cache:",
      request.url
    );

    return cached;
  }

  /*
   * NETWORK
   */

  try {
    const response = await fetch(
      request
    );

    const shouldCache =
      response.ok ||
      response.type === "opaque";

    if (shouldCache) {
      try {
        const cacheUrl =
          new URL(request.url);

        cacheUrl.search = "";
        cacheUrl.hash = "";

        const cacheKey =
          new Request(
            cacheUrl.toString(),
            {
              method: "GET",
            }
          );

        await cache.put(
          cacheKey,
          response.clone()
        );

        console.log(
          "Image cached:",
          cacheUrl.toString()
        );
      } catch (cacheError) {
        console.warn(
          "Image cache write failed:",
          request.url,
          cacheError
        );
      }
    }

    return response;
  } catch (error) {
    console.warn(
      "Image network failed:",
      request.url
    );

    /*
     * FINAL CACHE FALLBACK
     */

    const fallback =
      await cache.match(
        request,
        {
          ignoreSearch: true,
        }
      );

    if (fallback) {
      console.log(
        "Image fallback served from cache:",
        request.url
      );

      return fallback;
    }

    return new Response(
      "",
      {
        status: 503,
        statusText:
          "Offline image unavailable",
      }
    );
  }
}

/*
 * ---------------------------------------------------------
 * FONTS
 * ---------------------------------------------------------
 */

async function handleFont(request) {
  const cache = await caches.open(
    FONT_CACHE_NAME
  );

  const cached = await cache.match(
    request
  );

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(
      request
    );

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

    return new Response(
      "",
      {
        status: 503,
        statusText:
          "Offline font unavailable",
      }
    );
  }
}

/*
 * ---------------------------------------------------------
 * SUPABASE API
 * ---------------------------------------------------------
 */

async function handleApi(request) {
  const cache = await caches.open(
    API_CACHE_NAME
  );

  try {
    const response = await fetch(
      request
    );

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
 * Never cache videos.
 * ---------------------------------------------------------
 */

async function handleVideo(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response(
      "",
      {
        status: 503,
        statusText:
          "Offline video unavailable",
      }
    );
  }
}

/*
 * ---------------------------------------------------------
 * SAME-ORIGIN ASSETS
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
    const response = await fetch(
      request
    );

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

    return new Response(
      "",
      {
        status: 503,
        statusText:
          "Offline asset unavailable",
      }
    );
  }
}

/*
 * ---------------------------------------------------------
 * FETCH
 * ---------------------------------------------------------
 */

self.addEventListener(
  "fetch",
  (event) => {
    const request = event.request;

    /*
     * Only GET.
     */

    if (request.method !== "GET") {
      return;
    }

    const url = new URL(
      request.url
    );

    /*
     * Only same-origin and Supabase.
     */

    if (
      url.origin !==
        self.location.origin &&
      url.origin !== SUPABASE_ORIGIN
    ) {
      return;
    }

    /*
     * -------------------------------------------------------
     * NAVIGATION / HTML
     *
     * IMPORTANT:
     *
     * This MUST happen before handleAsset().
     * -------------------------------------------------------
     */

    if (isNavigation(request)) {
      console.log(
        "SW navigation request:",
        request.url,
        "mode:",
        request.mode,
        "destination:",
        request.destination
      );

      event.respondWith(
        handleNavigation(request)
      );

      return;
    }

    /*
     * -------------------------------------------------------
     * SUPABASE IMAGES
     * -------------------------------------------------------
     */

    if (isSupabaseImage(request)) {
      event.respondWith(
        handleImage(request)
      );

      return;
    }

    /*
     * -------------------------------------------------------
     * FONTS
     * -------------------------------------------------------
     */

    if (isFont(request)) {
      event.respondWith(
        handleFont(request)
      );

      return;
    }

    /*
     * -------------------------------------------------------
     * SUPABASE REST API
     * -------------------------------------------------------
     */

    if (isApiRequest(request)) {
      event.respondWith(
        handleApi(request)
      );

      return;
    }

    /*
     * -------------------------------------------------------
     * VIDEOS
     * -------------------------------------------------------
     */

    if (isVideo(request)) {
      event.respondWith(
        handleVideo(request)
      );

      return;
    }

    /*
     * -------------------------------------------------------
     * SAME-ORIGIN ASSETS
     * -------------------------------------------------------
     */

    if (
      url.origin ===
      self.location.origin
    ) {
      event.respondWith(
        handleAsset(request)
      );
    }
  }
);