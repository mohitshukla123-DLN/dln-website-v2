import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

declare global {
  interface Navigator {
    getInstalledRelatedApps?: () => Promise<
      Array<{
        platform: string;
        url?: string;
        id?: string;
      }>
    >;
  }
}

const INSTALLED_KEY = "dln-pwa-installed";

export default function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] =
    useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    const isAndroid = /android/.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);

    const mobileOrTablet = isAndroid || isIOS;

    setIsMobileOrTablet(mobileOrTablet);

    /*
     * Only show the PWA prompt on phones/tablets.
     */
    if (!mobileOrTablet) {
      return;
    }

    /*
     * If the website is already running as an installed PWA,
     * don't show the installation prompt.
     */
    const isStandalone =
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches ||
      window.matchMedia(
        "(display-mode: fullscreen)"
      ).matches ||
      window.matchMedia(
        "(display-mode: minimal-ui)"
      ).matches;

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    /*
     * Local fallback.
     *
     * If this browser has already completed an installation,
     * don't show the prompt again.
     */
    if (
      localStorage.getItem(INSTALLED_KEY) === "true"
    ) {
      setInstalled(true);
      return;
    }

    /*
     * Try to detect an already-installed related PWA.
     */
    if (navigator.getInstalledRelatedApps) {
      navigator
        .getInstalledRelatedApps()
        .then((apps) => {
          if (apps.length > 0) {
            localStorage.setItem(
              INSTALLED_KEY,
              "true"
            );

            setInstalled(true);
          }
        })
        .catch(() => {
          // Ignore unsupported/failed detection.
        });
    }

    /*
     * Chrome/Android provides this event when
     * the website is eligible for native installation.
     */
    const handleBeforeInstallPrompt = (
      event: Event
    ) => {
      event.preventDefault();

      setInstallEvent(
        event as BeforeInstallPromptEvent
      );
    };

    /*
     * Fired after the PWA is successfully installed.
     */
    const handleAppInstalled = () => {
      localStorage.setItem(
        INSTALLED_KEY,
        "true"
      );

      setInstalled(true);
      setInstallEvent(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);

  /*
   * Never show on desktop.
   */
  if (!isMobileOrTablet) {
    return null;
  }

  /*
   * Never show inside the installed PWA.
   */
  if (installed) {
    return null;
  }

  /*
   * User closed the popup.
   *
   * This is intentionally NOT stored in localStorage.
   * Therefore it can appear again on a future visit/reload
   * if the app has not been installed.
   */
  if (dismissed) {
    return null;
  }

  async function handleInstall() {
    /*
     * Use Chrome's native installation prompt when available.
     */
    if (installEvent) {
      try {
        const result =
          await installEvent.prompt();

        if (result.outcome === "accepted") {
          localStorage.setItem(
            INSTALLED_KEY,
            "true"
          );

          setInstalled(true);
        }

        setInstallEvent(null);
      } catch (error) {
        console.error(
          "PWA install failed:",
          error
        );
      }

      return;
    }

    /*
     * If Chrome has not supplied the native prompt,
     * send the user to the dedicated installation guide.
     */
    window.location.href = "/install";
  }

  function handleClose() {
    setDismissed(true);
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/10">
      {/* Close button */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close install prompt"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold leading-none text-gray-700 shadow-sm hover:bg-gray-300 hover:text-black"
      >
        ×
      </button>

      <div className="pr-10">
        <h3 className="font-semibold text-gray-900">
          Install Dress Like Nawaabs
        </h3>

        <p className="mt-1 text-sm leading-5 text-gray-600">
          Install the app for quick access.
        </p>
      </div>

      <button
        type="button"
        onClick={handleInstall}
        className="mt-4 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
      >
        Install App
      </button>
    </div>
  );
}