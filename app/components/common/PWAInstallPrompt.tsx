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

  const [showHelp, setShowHelp] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    const isAndroid = /android/.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);

    const mobileOrTablet = isAndroid || isIOS;

    setIsMobileOrTablet(mobileOrTablet);

    /*
     * Desktop:
     * Never show this installation prompt.
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
     * Local fallback.
     *
     * This prevents the popup from repeatedly appearing
     * on the same browser/device after installation.
     */
    if (
      localStorage.getItem(INSTALLED_KEY) === "true"
    ) {
      setInstalled(true);
      return;
    }

    /*
     * Check whether the browser can detect an
     * already-installed related PWA.
     *
     * Supported mainly by Chromium-based browsers.
     */
    if (navigator.getInstalledRelatedApps) {
      navigator
        .getInstalledRelatedApps()
        .then((apps) => {
          if (apps.length > 0) {
            setInstalled(true);

            localStorage.setItem(
              INSTALLED_KEY,
              "true"
            );
          }
        })
        .catch(() => {
          // Ignore unsupported/failed detection.
        });
    }

    /*
     * Capture Chrome/Android's native install event.
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
     * When installation completes, Chrome fires
     * appinstalled.
     */
    const handleAppInstalled = () => {
      localStorage.setItem(
        INSTALLED_KEY,
        "true"
      );

      setInstalled(true);
      setInstallEvent(null);
      setShowHelp(false);
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
   * Never render on desktop.
   */
  if (!isMobileOrTablet) {
    return null;
  }

  /*
   * Never render after installation.
   */
  if (installed) {
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
     * No native prompt available.
     *
     * Send the user to the dedicated installation
     * instructions page.
     */
    window.location.href = "/install";
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800"
      >
        Install App
      </button>

      {showHelp && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold">
                Install Dress Like Nawaabs
              </h2>

              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Install Dress Like Nawaabs on your phone
              or tablet for quick access.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/install";
              }}
              className="mt-5 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
            >
              Open Installation Guide
            </button>

            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </>
  );
}