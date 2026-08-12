import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import { supabase } from "../../lib/supabase";

export default function AdminSiteSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");

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
      .eq("id", 1)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    if (!data) return;

    setLogoUrl(data.logo_url ?? "");
    setFaviconUrl(data.favicon_url ?? "");
    setSiteName(data.site_name ?? "");
    setTagline(data.tagline ?? "");
    setPhone(data.phone ?? "");
    setEmail(data.email ?? "");
    setAddress(data.address ?? "");
    setAnnouncement(data.announcement_text ?? "");
    setAnnouncementEnabled(data.announcement_enabled ?? true);
  }

  async function uploadLogo(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setUploadingLogo(true);

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "png";

      const fileName = `logo-${Date.now()}.${extension}`;

      const { error } = await supabase.storage
        .from("site-assets")
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("site-assets")
        .getPublicUrl(fileName);

      setLogoUrl(data.publicUrl);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Logo upload failed."
      );
    } finally {
      setUploadingLogo(false);
    }
  }

  async function uploadFavicon(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setUploadingFavicon(true);

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "png";

      const fileName = `favicon-${Date.now()}.${extension}`;

      const { error } = await supabase.storage
        .from("site-assets")
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("site-assets")
        .getPublicUrl(fileName);

      setFaviconUrl(data.publicUrl);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Favicon upload failed."
      );
    } finally {
      setUploadingFavicon(false);
    }
  }

  async function saveSettings() {
    setLoading(true);

    const { error } = await supabase
      .from("site_settings")
      .update({
        site_name: siteName,
        tagline,
        phone,
        email,
        address,
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        announcement_text: announcement,
        announcement_enabled: announcementEnabled,
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
              onChange={(e) => setSiteName(e.target.value)}
            />

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
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

            {/* WEBSITE LOGO */}
            <div>
              <label className="mb-2 block font-medium">
                Website Logo
              </label>

              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Website logo"
                  className="mb-4 h-20 rounded-lg border p-2"
                />
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={uploadLogo}
                disabled={uploadingLogo}
              />

              {uploadingLogo && (
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Uploading logo...
                </p>
              )}
            </div>

            {/* FAVICON */}
            <div>
              <label className="mb-2 block font-medium">
                Favicon
              </label>

              {faviconUrl && (
                <div className="mb-4">
                  <img
                    src={faviconUrl}
                    alt="Favicon preview"
                    className="h-16 w-16 rounded-lg border p-2 object-contain"
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/x-icon"
                onChange={uploadFavicon}
                disabled={uploadingFavicon}
              />

              {uploadingFavicon && (
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Uploading favicon...
                </p>
              )}
            </div>

            {/* ANNOUNCEMENT */}
            <textarea
              rows={3}
              className="w-full rounded-lg border p-3"
              placeholder="Announcement Bar"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e) =>
                  setAnnouncementEnabled(e.target.checked)
                }
              />

              Enable Announcement Bar
            </label>

            <button
              onClick={saveSettings}
              disabled={
                loading ||
                uploadingLogo ||
                uploadingFavicon
              }
              className="rounded-xl bg-black px-6 py-3 text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>

          </div>
        </div>
      </section>
    </Container>
  );
}