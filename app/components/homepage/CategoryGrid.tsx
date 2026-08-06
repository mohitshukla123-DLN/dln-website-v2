import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import Container from "../ui/Container";
import CategoryCard from "./CategoryCard";
import { categories } from "../../data/categories";

export default function CategoryGrid() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("homepage_settings")
        .select(
          `
          featured_categories_title,
          featured_categories_subtitle,
          featured_categories_enabled
          `
        )
        .limit(1)
        .single();

      setSettings(data);
    }

    loadSettings();
  }, []);

  if (settings?.featured_categories_enabled === false) {
    return null;
  }

  return (
    <section className="py-24">
      <Container>
        <div className="mb-14 text-center">
          <h2 className="text-5xl font-bold">
            {settings?.featured_categories_title ||
              "Shop by Category"}
          </h2>

          <p className="mt-5 text-[var(--muted)]">
            {settings?.featured_categories_subtitle ||
              "Explore our handcrafted collections."}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}