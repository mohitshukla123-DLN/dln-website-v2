declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

let initialized = false;

export function initializeAnalytics() {
  if (initialized) return;

  initialized = true;

  window.dataLayer = window.dataLayer || [];

  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-LLHZDVB6LP";
  script.async = true;
  document.head.appendChild(script);

  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }

  gtag("js", new Date());
  gtag("config", "G-LLHZDVB6LP");
}

export function trackPageView(path: string) {
  if (!initialized) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["event", "page_view", { page_path: path }]);
}