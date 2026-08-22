import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Favicon() {
  useEffect(() => {
    async function loadFavicon() {
      // Offline fallback
      if (!navigator.onLine) {
        setFavicon("/favicon.png");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("favicon_url")
          .eq("id", 1)
          .single();

        if (error) throw error;

        const favicon = data?.favicon_url?.trim();

        setFavicon(favicon || "/favicon.png");
      } catch {
        setFavicon("/favicon.png");
      }
    }

    function setFavicon(url: string) {
      let link = document.querySelector<HTMLLinkElement>(
        'link[rel="icon"]'
      );

      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }

      link.href = url;
    }

    loadFavicon();
  }, []);

  return null;
}