import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{
    outcome: "accepted" | "dismissed";
  }>;
}

export default function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [showIOSHelp, setShowIOSHelp] =
    useState(false);

  const [installed, setInstalled] =
    useState(false);

  const [ready, setReady] =
    useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & {
        standalone?: boolean;
      }).standalone === true;

    if (isStandalone) {
      setInstalled(true);
      setReady(true);
      return;
    }

    function handleBeforeInstallPrompt(
      event: Event
    ) {
      event.preventDefault();

      setInstallEvent(
        event as BeforeInstallPromptEvent
      );

      setReady(true);
    }

    function handleInstalled() {
      setInstalled(true);
      setInstallEvent(null);
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

    setReady(true);

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

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch((error) => {
        console.error(
          "Service worker registration failed:",
          error
        );
      });
  }, []);

  if (!ready || installed) return null;

  const isIOS =
    /iPad|iPhone|iPod/.test(
      navigator.userAgent
    ) &&
    !(window as Window & {
      MSStream?: unknown;
    }).MSStream;

  async function installApp() {
    if (installEvent) {
      const result =
        await installEvent.prompt();

      if (result.outcome === "accepted") {
        setInstalled(true);
      }

      return;
    }

    if (isIOS) {
      setShowIOSHelp(true);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={installApp}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-[var(--burgundy)] px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:opacity-90"
      >
        Install App
      </button>

      {showIOSHelp && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold">
              Install Dress Like Nawaabs
            </h2>

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

            <button
              type="button"
              onClick={() =>
                setShowIOSHelp(false)
              }
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