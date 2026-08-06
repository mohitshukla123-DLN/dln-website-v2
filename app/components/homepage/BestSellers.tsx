import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import Container from "../ui/Container";
import ProductCard from "../product/ProductCard";
import { products } from "../../data/products";

export default function BestSellers() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("homepage_settings")
        .select(`
          best_sellers_title,
          best_sellers_subtitle,
          best_sellers_enabled,
          best_sellers_count
        `)
        .limit(1)
        .single();

      setSettings(data);
    }

    loadSettings();
  }, []);

  if (settings?.best_sellers_enabled === false) {
    return null;
  }

  const count = settings?.best_sellers_count ?? 4;

  const bestSellers = products
    .filter((product) => product.bestseller)
    .slice(0, count);

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-24">
      <Container>

        <div className="mb-14 text-center">

          <p className="text-sm uppercase tracking-[0.35em] text-[var(--teal)]">
            Best Sellers
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            {settings?.best_sellers_title ??
              "Our Most Loved Outfits"}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[var(--muted)]">
            {settings?.best_sellers_subtitle ??
              "Discover the designs our customers choose for weddings, receptions and special celebrations."}
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </Container>
    </section>
  );
}