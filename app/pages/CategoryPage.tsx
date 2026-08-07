import { useParams } from "react-router-dom";

import Container from "../components/ui/Container";
import ProductGrid from "../components/shop/ProductGrid";

import { useEffect, useState } from "react";
import { getProducts } from "../lib/products";
import type { Product } from "../types/product";
import { categories } from "../data/categories";
import SEO from "../components/common/SEO";

export default function CategoryPage() {
  const { slug } = useParams();

  const category = categories.find(
    (item) => item.slug === slug
  );

  if (!category) {
    return (
      <>
      <Container>
        <section className="py-20 text-center">
          <h1 className="text-4xl font-bold">
            Category not found
          </h1>
        </section>
      </Container>
      </>
    );
  }

  const [products, setProducts] = useState<Product[]>([]);
      useEffect(() => {
        async function load() {
          const data = await getProducts();
          setProducts(data);
        }

        load();
      }, []);

const categoryProducts = products.filter(
    (product) =>
      product.category.toLowerCase() ===
      category.name.toLowerCase()
  );

  return (
    <>
    <SEO
      title={category.name}
      description={`Browse our premium ${category.name} collection.`}
      canonical={`https://dresslikenawaabs.pages.dev/category/${category.slug}`}
    />

    <section className="py-20">
      <Container>
        <div className="mb-14">
          <h1 className="text-5xl font-bold">
            {category.name}
          </h1>

          <p className="mt-4 text-[var(--muted)]">
            Browse our premium {category.name} collection.
          </p>
        </div>

        <ProductGrid products={categoryProducts} />
      </Container>
    </section>
    </>
  );
}