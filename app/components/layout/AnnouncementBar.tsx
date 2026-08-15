import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AnnouncementBar() {
  const [message, setMessage] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAnnouncement() {
      const { data } = await supabase
        .from("site_settings")
        .select("announcement_text, announcement_enabled")
        .eq("id", 1)
        .single();

      if (!mounted) return;

      const cleanedAnnouncement = (data?.announcement_text?.trim() || "")
        .replace(/wishlist/gi, "")
        .replace(/[❤️♥♡❤]/g, "")
        .replace(/[\u2764\u2665\u2661\uFE0F]/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();

      setMessage(cleanedAnnouncement);
      setEnabled(data?.announcement_enabled ?? false);
    }

    loadAnnouncement();

    return () => {
      mounted = false;
    };
  }, []);

  if (!enabled || !message) return null;

  return (
    <div className="bg-[var(--teal)] px-4 py-3 text-center text-base font-bold leading-6 text-white sm:text-lg">
      {message}
    </div>
  );
}
