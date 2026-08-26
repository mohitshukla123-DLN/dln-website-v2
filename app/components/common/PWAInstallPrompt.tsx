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

  const [dismissed, setDismissed] =
    useState(false);

  const [isMobileOrTablet, setIsMobileOrTablet] =
    useState(false);

  const [showHelp, setShowHelp] =
    useState(false);

  useEffect(() => {
    const userAgent =
      navigator.userAgent.toLowerCase();

    const isAndroid =
      /android/.test(userAgent);

    const isIOS =
      /iphone|ipad|ipod/.test(userAgent);

    const mobileOrTablet =
      isAndroid || isIOS;

    setIsMobileOrTablet(mobileOrTablet);

    /*
     * PWA installation prompt is only for
     * phones and tablets.
     */
    if (!mobileOrTablet) {
      return;
    }

    /*
     * If already running as the installed PWA,
     * never show the installation prompt.
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
     * Local installation flag.
     */
    if (
      localStorage.getItem(
        INSTALLED_KEY
      ) === "true"
    ) {
      setInstalled(true);
      return;
    }

    /*
     * Detect an already-installed related PWA
     * where the browser supports this API.
     */
    if (
      navigator.getInstalledRelatedApps
    ) {
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
          // Ignore unsupported browsers.
        });
    }

    /*
     * Chrome fires this when its native
     * installation prompt becomes available.
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
     * Chrome fires this after the PWA
     * has actually been installed.
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
   * Desktop: no PWA popup.
   */
  if (!isMobileOrTablet) {
    return null;
  }

  /*
   * Installed PWA: no PWA popup.
   */
  if (installed) {
    return null;
  }

  /*
   * X closes the popup for the current
   * page/component lifecycle only.
   */
  if (dismissed) {
    return null;
  }

  const userAgent =
    navigator.userAgent.toLowerCase();

  const isAndroid =
    /android/.test(userAgent);

  const isIOS =
    /iphone|ipad|ipod/.test(userAgent);

  async function handleInstall() {
    /*
     * Android Chrome native installation.
     */
    if (installEvent) {
      try {
        const result =
          await installEvent.prompt();

        if (
          result.outcome === "accepted"
        ) {
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
     * Native prompt is not available.
     * Open the dedicated installation guide.
     */
    setShowHelp(true);
  }

  function handleClose() {
    setDismissed(true);
  }

  return (
    <>
      {/* Compact install banner */}
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
        <div className="relative flex items-center gap-3 rounded-2xl bg-[#f5ebe7] px-4 py-3 shadow-xl ring-1 ring-[#7a1f2b]/20">
          {/* Close */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close install prompt"
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#faf7f2] text-lg font-bold leading-none text-[#7a1f2b] shadow-md ring-1 ring-[#7a1f2b]/20 hover:bg-[#f1ebe3]"
          >
            ×
          </button>

          {/* Text */}
          <p className="min-w-0 flex-1 text-sm font-normal leading-5 text-gray-900">
            Install{" "}
            <strong className="font-semibold">
              Dress Like Nawaabs App
            </strong>
            <span className="font-normal text-gray-700">
              {" "}
              for quick access.
            </span>
          </p>

          {/* Install */}
          <button
            type="button"
            onClick={handleInstall}
            className="shrink-0 rounded-xl bg-[#7a1f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#641923]"
          >
            Install App
          </button>
        </div>
      </div>

      {/* Installation instructions */}
      {showHelp && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Close */}
            <button
              type="button"
              onClick={() =>
                setShowHelp(false)
              }
              aria-label="Close"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#faf7f2] text-2xl font-bold leading-none text-[#7a1f2b] shadow-md ring-1 ring-[#7a1f2b]/20 hover:bg-[#f1ebe3]"
            >
              ×
            </button>

            <h2 className="pr-10 text-xl font-semibold text-gray-900">
              Install Dress Like Nawaabs
            </h2>

            {isAndroid && (
              <>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Install the app on your Android
                  phone or tablet:
                </p>

                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-700">
                  <li>
                    Open this website in{" "}
                    <strong>
                      Google Chrome
                    </strong>
                    .
                  </li>

                  <li>
                    Tap the{" "}
                    <strong>⋮</strong>{" "}
                    menu in the top-right corner.
                  </li>

                  <li>
                    Select{" "}
                    <strong>
                      Install and Create Shortcut
                    </strong>
                    .
                  </li>

                  <li>
                    Confirm the installation.
                  </li>
                </ol>
              </>
            )}

            {isIOS && (
              <>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Install the app on your
                  iPhone or iPad:
                </p>

                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-700">
                  <li>
                    Open this website in{" "}
                    <strong>Safari</strong>.
                  </li>

                  <li>
                    Tap the{" "}
                    <strong>Share</strong>{" "}
                    button.
                  </li>

                  <li>
                    Select{" "}
                    <strong>
                      Add to Home Screen
                    </strong>
                    .
                  </li>

                  <li>
                    Tap{" "}
                    <strong>Add</strong>.
                  </li>
                </ol>
              </>
            )}

            <button
              type="button"
              onClick={() =>
                setShowHelp(false)
              }
              className="mt-5 w-full rounded-xl bg-[#7a1f2b] px-4 py-3 text-sm font-semibold text-white hover:bg-[#641923]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}