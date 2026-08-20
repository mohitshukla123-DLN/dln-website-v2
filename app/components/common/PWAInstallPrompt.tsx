import { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const checkInstalled = async () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches ||
        (window.navigator as Navigator & {
          standalone?: boolean;
        }).standalone === true;

      let relatedAppInstalled = false;

      try {
        if ("getInstalledRelatedApps" in navigator) {
          const apps =
            await navigator.getInstalledRelatedApps();

          relatedAppInstalled = apps.length > 0;
        }
      } catch {
        // Ignore unsupported browsers
      }

      setInstalled(
        standalone || relatedAppInstalled
      );
    };

    checkInstalled();

    const media = window.matchMedia(
      "(display-mode: standalone)"
    );

    const handleChange = () => {
      checkInstalled();
    };

    media.addEventListener("change", handleChange);

    window.addEventListener(
      "appinstalled",
      checkInstalled
    );

    window.addEventListener(
      "pageshow",
      checkInstalled
    );

    document.addEventListener(
      "visibilitychange",
      checkInstalled
    );

    return () => {
      media.removeEventListener(
        "change",
        handleChange
      );

      window.removeEventListener(
        "appinstalled",
        checkInstalled
      );

      window.removeEventListener(
        "pageshow",
        checkInstalled
      );

      document.removeEventListener(
        "visibilitychange",
        checkInstalled
      );
    };
  }, []);

  if (installed) {
    return null;
  }

  const ua = navigator.userAgent.toLowerCase();

  const isIOS =
    /iphone|ipad|ipod/.test(ua);

  const isAndroid =
    /android/.test(ua);

  const isMac =
    /macintosh|mac os x/.test(ua);

  const isDesktop =
    !isIOS && !isAndroid;

  return (
    <>
      <button
        type="button"
        onClick={() => setShowHelp(true)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
      >
        Install App
      </button>

      {showHelp && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold">
                Install Dress Like Nawaabs
              </h2>

              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="text-2xl text-gray-400"
              >
                ×
              </button>
            </div>

            {isAndroid && (
              <>
                <p className="mt-3 text-sm text-gray-600">
                  Install on Android:
                </p>

                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-700">
                  <li>
                    Open this website in Chrome.
                  </li>
                  <li>
                    Tap the <strong>⋮</strong> menu.
                  </li>
                  <li>
                    Select{" "}
                    <strong>Install app</strong> or{" "}
                    <strong>Add to Home screen</strong>.
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
                  Install on iPhone or iPad:
                </p>

                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-700">
                  <li>
                    Open this website in Safari.
                  </li>
                  <li>
                    Tap the <strong>Share</strong> button.
                  </li>
                  <li>
                    Select{" "}
                    <strong>Add to Home Screen</strong>.
                  </li>
                  <li>
                    Tap <strong>Add</strong>.
                  </li>
                </ol>
              </>
            )}

            {isMac && isDesktop && (
              <>
                <p className="mt-3 text-sm text-gray-600">
                  Install on your Mac:
                </p>

                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-700">
                  <li>
                    Open this website in Google Chrome.
                  </li>
                  <li>
                    Click the <strong>Install</strong>{" "}
                    icon in the address bar.
                  </li>
                  <li>
                    Click <strong>Install</strong>.
                  </li>
                </ol>

                <p className="mt-4 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-500">
                  If Chrome does not show the install
                  icon, open the Chrome menu and look for
                  "Install Dress Like Nawaabs".
                </p>
              </>
            )}

            {!isAndroid &&
              !isIOS &&
              !isMac && (
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Open the browser menu and choose the
                  option to install Dress Like Nawaabs.
                </p>
              )}

            <button
              type="button"
              onClick={() => setShowHelp(false)}
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