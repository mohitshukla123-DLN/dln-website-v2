import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Container from "../../components/ui/Container";

export default function AdminSiteSettingsPage() {
  const [loading, setLoading] = useState(false);

  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");

  const [announcement, setAnnouncement] = useState("");
  const [announcementEnabled, setAnnouncementEnabled] =
    useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (!data) return;

    setSiteName(data.site_name ?? "");
    setTagline(data.tagline ?? "");

    setAnnouncement(data.announcement_text ?? "");
    setAnnouncementEnabled(
      data.announcement_enabled ?? true
    );
  }

  async function saveSettings() {
    setLoading(true);

    const { error } = await supabase
      .from("site_settings")
      .update({
        site_name: siteName,
        tagline,

        announcement_text: announcement,
        announcement_enabled:
          announcementEnabled,
      })
      .eq("id", 1);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Settings Saved");
  }

  return (
    <Container>

      <section className="py-16">

        <h1 className="mb-8 text-4xl font-bold">
          Site Settings
        </h1>

        <div className="rounded-2xl border bg-white p-8">

          <div className="space-y-5">

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Site Name"
              value={siteName}
              onChange={(e)=>
                setSiteName(e.target.value)
              }
            />

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Tagline"
              value={tagline}
              onChange={(e)=>
                setTagline(e.target.value)
              }
            />

            <textarea
              rows={3}
              className="w-full rounded-lg border p-3"
              placeholder="Announcement Bar"
              value={announcement}
              onChange={(e)=>
                setAnnouncement(e.target.value)
              }
            />

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e)=>
                  setAnnouncementEnabled(
                    e.target.checked
                  )
                }
              />

              Enable Announcement Bar

            </label>

            <button
              onClick={saveSettings}
              disabled={loading}
              className="rounded-xl bg-black px-6 py-3 text-white"
            >
              {loading
                ? "Saving..."
                : "Save Settings"}
            </button>

          </div>

        </div>

      </section>

    </Container>
  );
}