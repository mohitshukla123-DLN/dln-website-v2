import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";
import { getFeaturedProducts } from "../../lib/products";

import Container from "../ui/Container";
import ProductCard from "../product/ProductCard";

import type { Product } from "../../types/product";

export default function FeaturedCollections() {
  const [settings, setSettings] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("homepage_settings")
        .select(`
          featured_collections_title,
          featured_collections_subtitle,
          featured_collections_enabled
        `)
        .single();

      setSettings(data);

      const items = await getFeaturedProducts();
      setProducts(items);
    }

    load();
  }, []);

  if (settings?.featured_collections_enabled === false) {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-24">
      <Container>

        <div className="mb-14 text-center">

          <p className="text-sm uppercase tracking-[0.35em] text-[var(--teal)]">
            Featured
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            {settings?.featured_collections_title ??
              "Featured Products"}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[var(--muted)]">
            {settings?.featured_collections_subtitle ??
              "Handpicked styles selected especially for you."}
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {products.map((product) => (
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