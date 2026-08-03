import ReactGA from "react-ga4";

export function initializeAnalytics() {
  ReactGA.initialize("G-LLHZDVB6LP");
}

export function trackPageView(path: string) {
  ReactGA.send({
    hitType: "pageview",
    page: path,
  });
}