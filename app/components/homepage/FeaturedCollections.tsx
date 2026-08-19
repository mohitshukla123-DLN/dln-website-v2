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
    <section id="featured-collections" className="scroll-mt-20 bg-[var(--background)] py-10 sm:py-16">
      <Container>
        <div className="mb-6 text-center sm:mb-10">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--burgundy)] sm:text-sm sm:tracking-[0.35em]">
            Featured
          </p>

          <h2 className="mt-1 text-2xl font-bold sm:mt-4 sm:text-4xl">
            {settings?.featured_collections_title ??
              "Featured Products"}
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm text-[var(--muted)] sm:mt-5 sm:text-base">
            {settings?.featured_collections_subtitle ??
              "Handpicked styles selected especially for you."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
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