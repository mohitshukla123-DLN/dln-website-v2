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

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    const isAndroid = /android/.test(ua);

    const isIOS =
      /iphone|ipad|ipod/.test(ua) ||
      (/macintosh/.test(ua) &&
        "ontouchend" in document);

    if (!isAndroid && !isIOS) {
      return;
    }

    const standalone =
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches ||
      window.matchMedia(
        "(display-mode: fullscreen)"
      ).matches ||
      (window.navigator as Navigator & {
        standalone?: boolean;
      }).standalone === true;

    if (standalone) {
      return;
    }

    const handlePrompt = (event: Event) => {
      event.preventDefault();

      setInstallEvent(
        event as BeforeInstallPromptEvent
      );

      setVisible(true);
    };

    const handleInstalled = () => {
      setVisible(false);
      setInstallEvent(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handlePrompt
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

    // Show our mobile installation entry point
    // even when the browser does not provide the
    // native installation event.
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 1500);

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener(
        "beforeinstallprompt",
        handlePrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleInstalled
      );
    };
  }, []);

  if (!visible) {
    return null;
  }

  async function handleInstall() {
    if (installEvent) {
      try {
        await installEvent.prompt();

        const result =
          await installEvent.userChoice;

        if (result.outcome === "accepted") {
          setVisible(false);
        }

        setInstallEvent(null);
        return;
      } catch (error) {
        console.error(
          "PWA installation failed:",
          error
        );
      }
    }

    window.location.href = "/install";
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="rounded-2xl bg-black p-4 text-white shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold">
              Install Dress Like Nawaabs
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-300">
              Install the app on your phone or
              tablet for quick access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setVisible(false)}
            className="text-xl leading-none text-gray-400"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <button
          type="button"
          onClick={handleInstall}
          className="mt-3 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black"
        >
          Install App
        </button>
      </div>
    </div>
  );
}