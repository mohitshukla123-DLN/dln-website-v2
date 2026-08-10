import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../../lib/supabase";
import { getNewArrivals } from "../../lib/products";

import Button from "../ui/Button";
import Container from "../ui/Container";
import ProductGrid from "../shop/ProductGrid";

import type { Product } from "../../types/product";

export default function NewArrivals() {
  const [settings, setSettings] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("homepage_settings")
        .select(`
          new_arrivals_title,
          new_arrivals_subtitle,
          new_arrivals_enabled,
          new_arrivals_count
        `)
        .single();

      setSettings(data);

      const configuredCount = data?.new_arrivals_count ?? 3;

      const items = await getNewArrivals(configuredCount);
      setProducts(items);
    }

    load();
  }, []);

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

        <div className="mb-12 flex items-center justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-[var(--teal)]">
              {settings?.new_arrivals_subtitle ??
                "Latest Collection"}
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {settings?.new_arrivals_title ??
                "New Arrivals"}
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