export function initializeClarity() {
  if (typeof window === "undefined") return;

  (function (c: any, l: Document, a: string, r: string, i: string, t?: HTMLScriptElement, y?: HTMLScriptElement) {
    c[a] =
      c[a] ||
      function (...args: unknown[]) {
        (c[a].q = c[a].q || []).push(args);
      };

    t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;

    y = l.getElementsByTagName(r)[0] as HTMLScriptElement;
    y.parentNode?.insertBefore(t, y);
  })(window, document, "clarity", "script", "xwq1i03hj3");
}