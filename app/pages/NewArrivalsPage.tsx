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

      <section className="bg-[#5b2333] py-10 text-white sm:py-14">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl font-bold sm:text-5xl">
              New Arrivals
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-sm text-white/80 sm:mt-4 sm:text-base">
              Discover the latest additions to our collection.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-[var(--background)] py-10 sm:py-16">
        <Container>
          {loading ? (
            <p className="py-10 text-center text-[var(--muted)]">
              Loading...
            </p>
          ) : (
            <ProductGrid products={newProducts} />
          )}
        </Container>
      </section>
    </>
  );
}
