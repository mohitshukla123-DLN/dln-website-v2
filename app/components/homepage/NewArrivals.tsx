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
    <section id="new-arrivals-section" className="scroll-mt-20 bg-[var(--background)] py-24">
      <Container>

        <div className="relative mb-14 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--teal)]">
            {settings?.new_arrivals_subtitle ?? "Latest Collection"}
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {settings?.new_arrivals_title ?? "New Arrivals"}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[var(--muted)]">
            Discover the latest additions to our collection.
          </p>

        </div>

        <div className="mb-6 flex justify-center sm:justify-end sm:justify-end">
          <Link to="/new-arrivals">
            <Button className="px-4 py-2 text-sm">View All</Button>
          </Link>
        </div>

        <ProductGrid products={newProducts} />

      </Container>
    </section>
  );
}