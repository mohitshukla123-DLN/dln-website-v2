import { useEffect, useState } from "react";
import { getBestSellers } from "../../lib/products";
import type { HomepageSettings } from "../../types/homepage";
import Container from "../ui/Container";
import ProductCard from "../product/ProductCard";

import type { Product } from "../../types/product";

interface Props {
  settings: HomepageSettings | null;
}

export default function BestSellers({ settings }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
  async function load() {
    const configuredCount =
      settings?.best_sellers_count ?? 4;

    const items = await getBestSellers(configuredCount);
    setProducts(items);
  }

  load();
}, [
  settings?.best_sellers_count,
  settings?.best_sellers_enabled,
]);

  if (settings?.best_sellers_enabled === false) {
    return null;
  }

  const bestSellers = products;

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="py-24">
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

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