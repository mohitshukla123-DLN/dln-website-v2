import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../../lib/analytics";

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    const track = () => {
      trackPageView(location.pathname + location.search);
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(track, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }

    const id = setTimeout(track, 3000);
    return () => window.clearTimeout(id);
  }, [location]);

  return null;
}