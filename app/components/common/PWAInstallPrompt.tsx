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
const DISMISSED_KEY = "dln-pwa-install-dismissed";

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
     * Desktop:
     * Never show the PWA installation prompt.
     */
    if (!mobileOrTablet) {
      return;
    }

    /*
     * If already running as an installed PWA,
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
     * If the user has already installed the app
     * on this browser/device, don't show the prompt.
     */
    if (
      localStorage.getItem(INSTALLED_KEY) === "true"
    ) {
      setInstalled(true);
      return;
    }

    /*
     * If the user previously pressed Cancel,
     * don't show the prompt again.
     */
    if (
      localStorage.getItem(DISMISSED_KEY) === "true"
    ) {
      setDismissed(true);
      return;
    }

    /*
     * Check whether the browser can detect an
     * already-installed related PWA.
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
     * Capture Chrome/Android's native installation event.
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
     * Fired when the PWA has been installed.
     */
    const handleAppInstalled = () => {
      localStorage.setItem(
        INSTALLED_KEY,
        "true"
      );

      localStorage.removeItem(DISMISSED_KEY);

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
   * Don't show after the user pressed Cancel.
   */
  if (dismissed) {
    return null;
  }

  async function handleInstall() {
    /*
     * Chrome/Android native installation.
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

          localStorage.removeItem(DISMISSED_KEY);

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
     * If Chrome hasn't provided the native
     * installation prompt, open the dedicated
     * installation guide.
     */
    window.location.href = "/install";
  }

  function handleCancel() {
    localStorage.setItem(
      DISMISSED_KEY,
      "true"
    );

    setDismissed(true);
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/10">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900">
            Install Dress Like Nawaabs
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            Install the app for quick access.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleInstall}
            className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}