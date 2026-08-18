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
    <section id="best-sellers" className="scroll-mt-20 bg-[var(--background)] py-10 sm:py-16">
      <Container>

        <div className="mb-6 text-center sm:mb-10">

          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--burgundy)] sm:text-sm sm:tracking-[0.35em]">
            Best Sellers
          </p>

          <h2 className="mt-1 text-2xl font-bold sm:mt-4 sm:text-4xl">
            {settings?.best_sellers_title ??
              "Our Most Loved Outfits"}
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm text-[var(--muted)] sm:mt-5 sm:text-base">
            {settings?.best_sellers_subtitle ??
              "Discover the designs our customers choose for weddings, receptions and special celebrations."}
          </p>

        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">

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