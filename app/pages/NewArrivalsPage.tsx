import { useEffect, useState } from "react";

import Container from "../components/ui/Container";
import ProductGrid from "../components/shop/ProductGrid";
import SEO from "../components/common/SEO";

import { getNewArrivals } from "../lib/products";
import type { Product } from "../types/product";

export default function NewArrivalsPage() {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const data = await getNewArrivals();
      setNewProducts(data);
      setLoading(false);
    }

    loadProducts();
  }, []);

  return (
    <>
      <SEO
        title="New Arrivals"
        description="Discover the latest ethnic wear arrivals from Dress Like Nawaabs."
        canonical="https://dresslikenawaabs.pages.dev/new-arrivals"
      />

      <section className="py-20">
        <Container>
          <h1 className="text-5xl font-bold">
            New Arrivals
          </h1>

          <p className="mt-4 mb-10 text-[var(--muted)]">
            Discover the latest additions to our collection.
          </p>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <ProductGrid products={newProducts} />
          )}
        </Container>
      </section>
    </>
  );
}