import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export default function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    const isAndroid = /android/.test(ua);

    const isIOS =
      /iphone|ipad|ipod/.test(ua) ||
      (/macintosh/.test(ua) &&
        "ontouchend" in document);

    const isMobileOrTablet =
      isAndroid || isIOS;

    // Never show anything on desktop/laptop.
    if (!isMobileOrTablet) {
      return;
    }

    const isStandalone =
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches ||
      window.matchMedia(
        "(display-mode: fullscreen)"
      ).matches ||
      window.matchMedia(
        "(display-mode: minimal-ui)"
      ).matches ||
      (window.navigator as Navigator & {
        standalone?: boolean;
      }).standalone === true;

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (
      event: Event
    ) => {
      event.preventDefault();

      const promptEvent =
        event as BeforeInstallPromptEvent;

      setInstallEvent(promptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setShowPrompt(false);
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

    // Android may not fire beforeinstallprompt
    // immediately. Give Chrome a little time.
    const timer = window.setTimeout(() => {
      setShowPrompt(true);
    }, 1500);

    return () => {
      window.clearTimeout(timer);

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

  if (installed || !showPrompt) {
    return null;
  }

  const ua = navigator.userAgent.toLowerCase();

  const isAndroid = /android/.test(ua);

  const isIOS =
    /iphone|ipad|ipod/.test(ua) ||
    (/macintosh/.test(ua) &&
      "ontouchend" in document);

  async function handleInstall() {
    if (installEvent) {
      try {
        await installEvent.prompt();

        const result =
          await installEvent.userChoice;

        if (result.outcome === "accepted") {
          setInstalled(true);
          setShowPrompt(false);
        }

        setInstallEvent(null);
      } catch (error) {
        console.error(
          "PWA installation failed:",
          error
        );
      }

      return;
    }

    // iOS and browsers without native prompt
    // use the instruction modal below.
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <div className="rounded-2xl bg-black p-4 text-white shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold">
                Install Dress Like Nawaabs
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-300">
                Add our app to your home screen for
                quick access.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPrompt(false)}
              className="text-xl leading-none text-gray-400"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (installEvent) {
                handleInstall();
              } else {
                setShowPrompt(true);
              }
            }}
            className="mt-3 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black"
          >
            Install App
          </button>
        </div>
      </div>

      {!installEvent && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setShowPrompt(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold">
                Install Dress Like Nawaabs
              </h2>

              <button
                type="button"
                onClick={() => setShowPrompt(false)}
                className="text-2xl text-gray-400"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {isAndroid && (
              <>
                <p className="mt-3 text-sm text-gray-600">
                  Install on your Android phone or
                  tablet:
                </p>

                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-700">
                  <li>
                    Open this website in{" "}
                    <strong>Google Chrome</strong>.
                  </li>

                  <li>
                    Tap the <strong>⋮</strong> menu.
                  </li>

                  <li>
                    Select{" "}
                    <strong>Install app</strong> or{" "}
                    <strong>
                      Add to Home screen
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
                <p className="mt-3 text-sm text-gray-600">
                  Install on your iPhone or iPad:
                </p>

                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-700">
                  <li>
                    Open this website in{" "}
                    <strong>Safari</strong>.
                  </li>

                  <li>
                    Tap the{" "}
                    <strong>Share</strong> button.
                  </li>

                  <li>
                    Select{" "}
                    <strong>
                      Add to Home Screen
                    </strong>
                    .
                  </li>

                  <li>
                    Tap <strong>Add</strong>.
                  </li>
                </ol>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowPrompt(false)}
              className="mt-6 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}