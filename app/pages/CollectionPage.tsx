import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Container from "../components/ui/Container";
import ProductGrid from "../components/shop/ProductGrid";
import SEO from "../components/common/SEO";

import { getProducts } from "../lib/products";
import type { Product } from "../types/product";
import { collections } from "../data/collections";

export default function CollectionPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const collection = collections.find(
    (item) => item.slug === slug
  );

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }

    loadProducts();
  }, []);

  if (!collection) {
    return (
      <>
        <Container>
          <section className="py-24 text-center">
            <h1 className="text-4xl font-bold">
              Collection not found
            </h1>
          </section>
        </Container>
      </>
    );
  }

  const filteredProducts = products.filter(
    (product) =>
      collection.badge &&
      product.badge === collection.badge
  );

  return (
    <>
      <SEO
        title={collection.title}
        description={collection.description}
        canonical={`https://dresslikenawaabs.pages.dev/collections/${collection.slug}`}
      />

      <section className="py-20">
        <Container>
          <h1 className="text-5xl font-bold">
            {collection.title}
          </h1>

          <p className="mt-4 mb-10 text-[var(--muted)]">
            {collection.description}
          </p>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </Container>
      </section>
    </>
  );
}