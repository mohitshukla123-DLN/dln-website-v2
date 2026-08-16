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

      <section className="bg-[#5b2333] py-10 sm:py-14 text-white">
        <Container>
          <h1 className="text-3xl font-bold sm:text-5xl">
            New Arrivals
          </h1>

          <p className="mt-2 mb-8 text-white/80 sm:mt-4 sm:mb-10">
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