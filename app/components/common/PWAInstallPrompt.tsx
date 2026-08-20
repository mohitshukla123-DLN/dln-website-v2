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

  useEffect(() => {
    const isAndroid =
      /android/i.test(navigator.userAgent);

    if (!isAndroid) {
      return;
    }

    const handleBeforeInstallPrompt = (
      event: Event
    ) => {
      event.preventDefault();

      const installEvent =
        event as BeforeInstallPromptEvent;

      console.log(
        "PWA: beforeinstallprompt captured"
      );

      setInstallPrompt(installEvent);
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

  const handleInstall = async () => {
    if (!installPrompt) {
      console.log(
        "PWA: native install prompt unavailable"
      );

      setShowHelp(true);
      return;
    }

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
      }

      setInstallPrompt(null);
    } catch (error) {
      console.error(
        "PWA install prompt failed:",
        error
      );
    }
  };

  if (installed) {
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
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
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

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Chrome has not provided the automatic
              installation prompt yet.
            </p>

            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-700">
              <li>
                Tap Chrome's <strong>⋮</strong> menu.
              </li>

              <li>
                Tap{" "}
                <strong>
                  Install app
                </strong>{" "}
                or{" "}
                <strong>
                  Add to Home screen
                </strong>
                .
              </li>

              <li>
                Follow Chrome's installation prompt.
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full rounded-xl bg-gray-100 py-3 text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}