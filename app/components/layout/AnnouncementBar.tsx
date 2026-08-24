import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AnnouncementBar() {
  const [message, setMessage] = useState("");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const loadAnnouncement = async () => {
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
    };

    loadAnnouncement();
  }, []);

  if (!enabled || !message) {
    return null;
  }

  return (
    <div className="bg-[var(--burgundy)] text-white">
      <div className="flex items-center justify-center px-4 py-2">
        <p className="text-center font-bold animate-[announcement-blink_1.8s_ease-in-out_infinite]">
          {message}
        </p>
      </div>

      <style>{`
        @keyframes announcement-blink {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  );
}