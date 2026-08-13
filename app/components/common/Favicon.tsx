import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Favicon() {
  useEffect(() => {
    async function loadFavicon() {
      const { data } = await supabase
        .from("site_settings")
        .select("favicon_url")
        .eq("id", 1)
        .single();

      const favicon = data?.favicon_url?.trim();

      if (!favicon) return;

      let link = document.querySelector<HTMLLinkElement>(
        'link[rel="icon"]'
      );

      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }

      link.href = `${favicon}?v=${Date.now()}`;
    }

    loadFavicon();
  }, []);

  return null;
}