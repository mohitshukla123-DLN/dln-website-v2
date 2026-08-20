import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export default function InstallPage() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [installed, setInstalled] = useState(false);

  const ua =
    typeof navigator !== "undefined"
      ? navigator.userAgent.toLowerCase()
      : "";

  const isAndroid = /android/.test(ua);

  const isIOS =
    /iphone|ipad|ipod/.test(ua) ||
    (/macintosh/.test(ua) &&
      "ontouchend" in document);

  const isStandalone =
  typeof window !== "undefined" &&
  window.matchMedia("(display-mode: standalone)").matches;

  useEffect(() => {
    if (isStandalone) {
      setInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (
      event: Event
    ) => {
      event.preventDefault();

      setInstallEvent(
        event as BeforeInstallPromptEvent
      );
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

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
  }, [isStandalone]);

  async function installAndroid() {
    if (!installEvent) return;

    try {
      await installEvent.prompt();

      const result =
        await installEvent.userChoice;

      if (result.outcome === "accepted") {
        setInstalled(true);
      }

      setInstallEvent(null);
    } catch (error) {
      console.error(
        "PWA installation failed:",
        error
      );
    }
  }

  if (installed) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="text-5xl">✓</div>

          <h1 className="mt-6 text-2xl font-semibold">
            Dress Like Nawaabs is installed
          </h1>

          <p className="mt-3 text-gray-600">
            You can now open Dress Like Nawaabs
            directly from your home screen.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">
            Install Dress Like Nawaabs
          </h1>

          <p className="mt-3 text-gray-600">
            Install the app on your phone or tablet
            for quick access.
          </p>
        </div>

        {isAndroid && installEvent && (
          <div className="mt-8 rounded-2xl border p-6">
            <h2 className="text-xl font-semibold">
              Install on Android
            </h2>

            <p className="mt-3 text-sm text-gray-600">
              Chrome can install Dress Like Nawaabs
              directly on this device.
            </p>

            <button
              type="button"
              onClick={installAndroid}
              className="mt-6 w-full rounded-xl bg-black px-5 py-4 font-semibold text-white"
            >
              Install Dress Like Nawaabs
            </button>
          </div>
        )}

        {isAndroid && !installEvent && (
          <div className="mt-8 rounded-2xl border p-6">
            <h2 className="text-xl font-semibold">
              Install on Android
            </h2>

            <ol className="mt-5 list-decimal space-y-4 pl-5 text-sm leading-6 text-gray-700">
              <li>
                Open this page in{" "}
                <strong>Google Chrome</strong>.
              </li>

              <li>
                Tap the <strong>⋮</strong> button in
                the top-right corner.
              </li>

              <li>
                Tap{" "}
                <strong>
                  Install app
                </strong>
                .
              </li>

              <li>
                If you don't see{" "}
                <strong>Install app</strong>, tap{" "}
                <strong>
                  Add to Home screen
                </strong>
                .
              </li>

              <li>
                Tap <strong>Install</strong> or{" "}
                <strong>Add</strong> to confirm.
              </li>
            </ol>
          </div>
        )}

        {isIOS && (
          <div className="mt-8 rounded-2xl border p-6">
            <h2 className="text-xl font-semibold">
              Install on iPhone or iPad
            </h2>

            <ol className="mt-5 list-decimal space-y-4 pl-5 text-sm leading-6 text-gray-700">
              <li>
                Open this page in{" "}
                <strong>Safari</strong>.
              </li>

              <li>
                Tap the{" "}
                <strong>Share</strong> button.
              </li>

              <li>
                Scroll down in the Share menu.
              </li>

              <li>
                Tap{" "}
                <strong>
                  Add to Home Screen
                </strong>
                .
              </li>

              <li>
                Tap <strong>Add</strong>.
              </li>
            </ol>

            <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
              <strong>Important:</strong> On iPhone
              and iPad, installation must be done
              through Safari.
            </div>
          </div>
        )}

        {!isAndroid && !isIOS && (
          <div className="mt-8 rounded-2xl border p-6 text-center">
            <h2 className="text-xl font-semibold">
              Open on your phone or tablet
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              This installation page is designed
              for Android phones, Android tablets,
              iPhones and iPads.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}