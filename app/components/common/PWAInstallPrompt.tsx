import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{
    outcome: "accepted" | "dismissed";
  }>;
}

export default function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function checkInstalled() {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & {
          standalone?: boolean;
        }).standalone === true;

      setInstalled(standalone);
      setReady(true);
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();

      setInstallEvent(
        event as BeforeInstallPromptEvent
      );
    }

    function handleInstalled() {
      checkInstalled();
      setInstallEvent(null);
      setShowHelp(false);
    }

    checkInstalled();

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
        })
        .catch((error) => {
          console.error(
            "Service worker registration failed:",
            error
          );
        });
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleInstalled
      );
    };
  }, []);

  if (!ready || installed) {
    return null;
  }

  const isIOS =
    /iPad|iPhone|iPod/.test(
      navigator.userAgent
    ) &&
    !(window as Window & {
      MSStream?: unknown;
    }).MSStream;

  async function handleInstall() {
    if (!installEvent) {
      setShowHelp(true);
      return;
    }

    const result = await installEvent.prompt();

    if (result.outcome === "dismissed") {
      setInstallEvent(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-[var(--burgundy)] px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:opacity-90"
      >
        Install App
      </button>

      {showHelp && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold">
              Install Dress Like Nawaabs
            </h2>

            {isIOS ? (
              <>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  On your iPhone or iPad:
                </p>

                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-700">
                  <li>
                    Tap the Share button in Safari.
                  </li>
                  <li>
                    Choose "Add to Home Screen".
                  </li>
                  <li>
                    Tap "Add".
                  </li>
                </ol>
              </>
            ) : (
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Open your browser menu and choose
                "Install app" or "Add to Home screen".
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
