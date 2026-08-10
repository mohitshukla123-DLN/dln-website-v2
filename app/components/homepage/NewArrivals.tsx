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
    <section className="py-24">
      <Container>

        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--teal)]">
              {settings?.new_arrivals_subtitle ?? "Latest Collection"}
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight lg:text-5xl">
              {settings?.new_arrivals_title ?? "New Arrivals"}
            </h2>
          </div>

          <Link to="/new-arrivals">
            <Button>
              View All
            </Button>
          </Link>
        </div>

        <ProductGrid products={newProducts} />

      </Container>
    </section>
  );
}