import { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & { standalone?: boolean })
          .standalone === true;

      setInstalled(standalone);
    };

    checkInstalled();

    window.addEventListener("appinstalled", checkInstalled);

    const media = window.matchMedia("(display-mode: standalone)");
    media.addEventListener("change", checkInstalled);

    return () => {
      window.removeEventListener("appinstalled", checkInstalled);
      media.removeEventListener("change", checkInstalled);
    };
  }, []);

  if (installed) return null;

  const ua = navigator.userAgent.toLowerCase();

  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isMac = /macintosh|mac os x/.test(ua);

  const isChrome =
    /chrome|crios/.test(ua) &&
    !/edg|opr|opera/.test(ua);

  const isSafari =
    /safari/.test(ua) &&
    !/chrome|crios|android/.test(ua);

  const isDesktop = !isIOS && !isAndroid;

  const handleInstall = () => {
    setShowHelp(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
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

            {/* ANDROID */}
            {isAndroid && (
              <>
                <p className="mt-3 text-sm text-gray-600">
                  Install on your Android phone:
                </p>

                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-700">
                  <li>
                    Open Dress Like Nawaabs in{" "}
                    <strong>Google Chrome</strong>.
                  </li>
                  <li>
                    Tap the <strong>⋮</strong> menu.
                  </li>
                  <li>
                    Select{" "}
                    <strong>
                      Install app
                    </strong>{" "}
                    or{" "}
                    <strong>
                      Add to Home screen
                    </strong>
                    .
                  </li>
                  <li>Confirm the installation.</li>
                </ol>

                {!isChrome && (
                  <p className="mt-4 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800">
                    For the best installation experience,
                    open this website in Google Chrome.
                  </p>
                )}
              </>
            )}

            {/* IPHONE / IPAD */}
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
                    Tap the <strong>Share</strong> button.
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

                {!isSafari && (
                  <p className="mt-4 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800">
                    iPhone/iPad installation requires Safari.
                  </p>
                )}
              </>
            )}

            {/* MAC */}
              {isMac && isDesktop && (
                <>
                  <p className="mt-3 text-sm text-gray-600">
                    Install on your Mac:
                  </p>

                  <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-700">
                    <li>
                      Open this website in{" "}
                      <strong>Google Chrome</strong>.
                    </li>
                    <li>
                      Click the <strong>⋮</strong> menu in the
                      top-right corner.
                    </li>
                    <li>
                      Look for{" "}
                      <strong>Install Dress Like Nawaabs</strong>.
                    </li>
                    <li>
                      Click it and confirm{" "}
                      <strong>Install</strong>.
                    </li>
                  </ol>

                  <p className="mt-4 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-500">
                    If "Install Dress Like Nawaabs" is not shown,
                    Chrome has not made the site available for
                    installation on this browser yet.
                  </p>
                </>
              )}

            {/* OTHER DESKTOP */}
            {!isAndroid && !isIOS && !isMac && (
              <>
                <p className="mt-3 text-sm text-gray-600">
                  Install Dress Like Nawaabs from your
                  browser.
                </p>

                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-700">
                  <li>
                    Open the browser menu.
                  </li>
                  <li>
                    Look for{" "}
                    <strong>Install Dress Like Nawaabs</strong>{" "}
                    or <strong>Install app</strong>.
                  </li>
                  <li>
                    Confirm the installation.
                  </li>
                </ol>
              </>
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
