import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Container from "../../components/ui/Container";

export default function AdminSiteSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [announcement, setAnnouncement] = useState("");
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  if (!data) return;

  setLogoUrl(data.logo_url ?? "");
  setSiteName(data.site_name ?? "");
  setTagline(data.tagline ?? "");
  setPhone(data.phone ?? "");
  setEmail(data.email ?? "");
  setAddress(data.address ?? "");
  setAnnouncement(data.announcement_text ?? "");
  setAnnouncementEnabled(
    data.announcement_enabled ?? true
  );
}

    async function uploadLogo(
      e: React.ChangeEvent<HTMLInputElement>
    ) {
      if (!e.target.files?.length) return;

      const file = e.target.files[0];

      const extension = file.name.split(".").pop();

      const fileName = `logo-${Date.now()}.${extension}`;

      const { error } = await supabase.storage
        .from("site-assets")
        .upload(fileName, file);

      if (error) {
        alert(error.message);
        return;
      }

      const { data } = supabase.storage
        .from("site-assets")
        .getPublicUrl(fileName);

      setLogoUrl(data.publicUrl);
    }


  async function saveSettings() {
    setLoading(true);

    console.log(await supabase.auth.getSession());

    const { error } = await supabase
      .from("site_settings")
      .update({
          site_name: siteName,
          tagline,
          phone,
          email,
          address,

          logo_url: logoUrl,

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

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div>

              <label className="mb-2 block font-medium">
                Website Logo
              </label>

              {logoUrl && (
                <img
                  src={logoUrl}
                  alt=""
                  className="mb-4 h-20 rounded-lg border p-2"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={uploadLogo}
              />

            </div>

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