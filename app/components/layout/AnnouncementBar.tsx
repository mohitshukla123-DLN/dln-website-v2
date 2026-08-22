import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AnnouncementBar() {
  const [message, setMessage] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    async function loadAnnouncement() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("announcement_text, announcement_enabled")
        .single();

      if (error) {
        console.error("Failed to load announcement:", error);
        return;
      }

      setMessage(data?.announcement_text?.trim() || "");
      setEnabled(data?.announcement_enabled ?? false);
    }

    loadAnnouncement();
  }, []);

  if (!enabled || !message) {
    return null;
  }

  return (
    <div className="overflow-hidden bg-[var(--burgundy)] text-white">
      <div className="relative flex h-8 items-center overflow-hidden">
        <div className="flex min-w-max animate-[announcement-scroll_18s_linear_infinite] whitespace-nowrap">
          <span className="px-8 text-xs font-medium sm:text-sm">
            {message}
          </span>

          <span className="px-8 text-xs font-medium sm:text-sm">
            {message}
          </span>

          <span className="px-8 text-xs font-medium sm:text-sm">
            {message}
          </span>

          <span className="px-8 text-xs font-medium sm:text-sm">
            {message}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes announcement-scroll {
          from {
            transform: translateX(-25%);
          }
          to {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  );
}