import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import Container from "../ui/Container";

const collections = [
  {
    title: "Sherwanis",
    description:
      "Royal wedding attire handcrafted with timeless elegance.",
    icon: "👑",
  },
  {
    title: "Kurta Sets",
    description:
      "Sophisticated festive wear designed for every celebration.",
    icon: "✨",
  },
  {
    title: "Indo-Western",
    description:
      "Modern silhouettes with timeless Indian craftsmanship.",
    icon: "🧵",
  },
];

export default function FeaturedCollections() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("homepage_settings")
        .select(`
          featured_collections_title,
          featured_collections_subtitle,
          featured_collections_enabled
        `)
        .limit(1)
        .single();

      setSettings(data);
    }

    loadSettings();
  }, []);

  if (settings?.featured_collections_enabled === false) {
    return null;
  }

  return (
    <section className="bg-white py-24">
      <Container>

        <div className="mb-14 text-center">

          <p className="text-sm uppercase tracking-[0.35em] text-[var(--teal)]">
            Collections
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            {settings?.featured_collections_title ??
              "Featured Collections"}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[var(--muted)]">
            {settings?.featured_collections_subtitle ??
              "Explore handcrafted ensembles inspired by India's royal heritage and contemporary luxury."}
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {collections.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-5xl">
                {item.icon}
              </div>

              <h3 className="mt-8 text-2xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-4 text-[var(--muted)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>

      </Container>
    </section>
  );
}