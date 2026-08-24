export function initializeClarity() {
  if (typeof window === "undefined") return;

  const load = () => {
    if (document.querySelector('script[src*="clarity.ms"]')) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.clarity.ms/tag/xwq1i03hj3";
    document.head.appendChild(script);
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(load, { timeout: 3000 });
  } else {
    setTimeout(load, 3000);
  }
}