import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import { supabase } from "../../lib/supabase";

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState(false);

  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroButtonText, setHeroButtonText] = useState("");
  const [heroButtonUrl, setHeroButtonUrl] = useState("");

  async function loadSettings() {
    const { data } = await supabase
      .from("homepage_settings")
      .select("*")
      .limit(1)
      .single();

    if (!data) return;

    setHeroTitle(data.hero_title ?? "");
    setHeroSubtitle(data.hero_subtitle ?? "");
    setHeroButtonText(data.hero_button_text ?? "");
    setHeroButtonUrl(data.hero_button_url ?? "");
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function saveSettings() {
    setLoading(true);

    const { error } = await supabase
      .from("homepage_settings")
      .update({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_button_text: heroButtonText,
        hero_button_url: heroButtonUrl,
      })
      .eq("id", 1);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Homepage updated.");
  }

  return (
    <Container>
      <section className="py-16 max-w-5xl">

        <h1 className="text-4xl font-bold">
          Homepage CMS
        </h1>

        <p className="mt-2 text-[var(--muted)]">
          Manage homepage content.
        </p>

        <div className="mt-10 rounded-2xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Hero Section
          </h2>

          <div className="mt-6 space-y-4">

            <input
              className="w-full rounded-lg border p-3"
              value={heroTitle}
              placeholder="Hero Title"
              onChange={(e) => setHeroTitle(e.target.value)}
            />

            <textarea
              className="w-full rounded-lg border p-3"
              rows={4}
              value={heroSubtitle}
              placeholder="Hero Subtitle"
              onChange={(e) => setHeroSubtitle(e.target.value)}
            />

            <input
              className="w-full rounded-lg border p-3"
              value={heroButtonText}
              placeholder="Button Text"
              onChange={(e) => setHeroButtonText(e.target.value)}
            />

            <input
              className="w-full rounded-lg border p-3"
              value={heroButtonUrl}
              placeholder="Button URL"
              onChange={(e) => setHeroButtonUrl(e.target.value)}
            />

            <button
              onClick={saveSettings}
              disabled={loading}
              className="rounded-xl bg-black px-6 py-3 text-white"
            >
              {loading ? "Saving..." : "Save"}
            </button>

          </div>

        </div>

      </section>
    </Container>
  );
}