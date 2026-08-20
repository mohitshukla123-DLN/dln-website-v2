import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [installed, setInstalled] = useState(false);

  const [showHelp, setShowHelp] = useState(false);

  const [isMobileOrTablet, setIsMobileOrTablet] =
    useState(false);

  const [isStandalone, setIsStandalone] =
    useState(false);

  useEffect(() => {
    const userAgent =
      navigator.userAgent.toLowerCase();

    const mobileOrTablet =
      /android|iphone|ipad|ipod/.test(userAgent);

    setIsMobileOrTablet(mobileOrTablet);

    const standalone =
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches;

    setIsStandalone(standalone);

    if (!mobileOrTablet || standalone) {
      return;
    }

    const handleBeforeInstallPrompt = (
      event: Event
    ) => {
      event.preventDefault();

      console.log(
        "PWA: beforeinstallprompt captured"
      );

      setInstallPrompt(
        event as BeforeInstallPromptEvent
      );
    };

    const handleAppInstalled = () => {
      console.log("PWA: app installed");

      setInstalled(true);
      setInstallPrompt(null);
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

    const mediaQuery = window.matchMedia(
      "(display-mode: standalone)"
    );

    const handleDisplayModeChange = () => {
      setIsStandalone(mediaQuery.matches);
    };

    mediaQuery.addEventListener(
      "change",
      handleDisplayModeChange
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

      mediaQuery.removeEventListener(
        "change",
        handleDisplayModeChange
      );
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      try {
        console.log(
          "PWA: showing native install prompt"
        );

        await installPrompt.prompt();

        const choice =
          await installPrompt.userChoice;

        console.log(
          "PWA install result:",
          choice.outcome
        );

        if (choice.outcome === "accepted") {
          setInstalled(true);
          setShowHelp(false);
        }

        setInstallPrompt(null);
      } catch (error) {
        console.error(
          "PWA install failed:",
          error
        );

        setShowHelp(true);
      }

      return;
    }

    /*
     * Android Chrome may not expose
     * beforeinstallprompt even though the
     * browser provides its own installation
     * option.
     *
     * iOS/iPadOS also uses the manual flow.
     */
    setShowHelp(true);
  };

  /*
   * Desktop/laptop:
   * Never show the PWA installation prompt.
   */
  if (!isMobileOrTablet) {
    return null;
  }

  /*
   * Installed PWA:
   * Never show the installation prompt.
   */
  if (isStandalone || installed) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">
              Install Dress Like Nawaabs
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Install the app for quick access.
            </p>
          </div>

          <button
            type="button"
            onClick={handleInstall}
            className="shrink-0 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Install App
          </button>
        </div>
      </div>

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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Install Dress Like Nawaabs
              </h2>

              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="text-2xl text-gray-500"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/android/i.test(
              navigator.userAgent
            ) && (
              <>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Install on Android:
                </p>

                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-700">
                  <li>
                    Tap Chrome's{" "}
                    <strong>⋮</strong> menu.
                  </li>

                  <li>
                    Tap{" "}
                    <strong>
                      Install &amp; Create Shortcut
                    </strong>
                    .
                  </li>

                  <li>
                    Tap{" "}
                    <strong>Install</strong>.
                  </li>
                </ol>

                <p className="mt-4 text-xs leading-5 text-gray-500">
                  If Chrome says the app is already
                  installed, open{" "}
                  <strong>
                    Dress Like Nawaabs
                  </strong>{" "}
                  from your Android app drawer.
                </p>
              </>
            )}

            {/iphone|ipad|ipod/i.test(
              navigator.userAgent
            ) && (
              <>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Install on iPhone or iPad:
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
                    Tap{" "}
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
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}