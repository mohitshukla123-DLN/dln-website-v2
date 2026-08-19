import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNewArrivals } from "../../lib/products";
import type { HomepageSettings } from "../../types/homepage";

import Button from "../ui/Button";
import Container from "../ui/Container";
import ProductGrid from "../shop/ProductGrid";

import type { Product } from "../../types/product";

interface Props {
  settings: HomepageSettings | null;
}

export default function NewArrivals({ settings }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
  if (settings?.new_arrivals_enabled === false) {
    setProducts([]);
    return;
  }

  async function load() {
    const configuredCount = settings?.new_arrivals_count ?? 8;
    const items = await getNewArrivals(configuredCount);
    setProducts(items);
  }

  load();
}, [settings?.new_arrivals_count, settings?.new_arrivals_enabled]);


  if (settings?.new_arrivals_enabled === false) {
    return null;
  }

  const newProducts = products;

  if (newProducts.length === 0) {
    return null;
  }

  return (
    <section id="new-arrivals-section" className="scroll-mt-20 bg-[var(--surface)] py-10 sm:py-16">
      <Container>

        <div className="mb-6 text-center sm:mb-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--burgundy)] sm:text-sm sm:tracking-[0.35em]">
            {settings?.new_arrivals_subtitle ?? "Latest Collection"}
          </p>

          <h2 className="mt-1 text-2xl font-bold sm:mt-2 sm:text-4xl">
            {settings?.new_arrivals_title ?? "New Arrivals"}
          </h2>

          <div className="relative mt-2 flex flex-col items-center sm:mt-4">
            <p className="max-w-2xl text-center text-sm text-[var(--muted)] sm:text-base">
              Discover the latest additions to our collection.
            </p>

            <Link
              to="/new-arrivals"
              className="mt-3 shrink-0 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
            >
              <Button className="min-w-[96px] px-4 py-2 text-sm sm:min-w-[108px]">
                View All
              </Button>
            </Link>
          </div>
        </div>

        <ProductGrid products={newProducts} />

      </Container>
    </section>
  );
}