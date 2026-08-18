import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AnnouncementBar() {
  const [message, setMessage] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAnnouncement() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("announcement_text, announcement_enabled")
        .eq("id", 1)
        .single();

      if (!mounted) return;

      setMessage(data?.announcement_text?.trim() || "");
      setEnabled(data?.announcement_enabled ?? false);
    }

    loadAnnouncement();

    return () => {
      mounted = false;
    };
  }, []);

  if (!enabled || !message) return null;

  return (
    <div className="bg-[var(--burgundy)] px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white sm:py-3 sm:text-sm">
      {message}
    </div>
  );
}
