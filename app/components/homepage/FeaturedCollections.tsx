import { useEffect, useState } from "react";
import { getFeaturedProducts } from "../../lib/products";
import type { HomepageSettings } from "../../types/homepage";
import Container from "../ui/Container";
import ProductCard from "../product/ProductCard";

import type { Product } from "../../types/product";

interface Props {
  settings: HomepageSettings | null;
}

export default function FeaturedCollections({ settings }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
  async function load() {
    const configuredCount =
      settings?.featured_collections_count ?? 6;

    const items = await getFeaturedProducts(configuredCount);
    setProducts(items);
  }

  load();
}, [
  settings?.featured_collections_count,
  settings?.featured_collections_enabled,
]);

  if (settings?.featured_collections_enabled === false) {
    return null;
  }

  const featuredProducts = products;

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section id="featured-collections" className="scroll-mt-20 bg-[#f1eee8] py-24">
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
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