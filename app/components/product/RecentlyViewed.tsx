import { useEffect, useState } from "react";
import { getProducts } from "../../lib/products";
import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";

interface Props {
  currentSlug: string;
}

export default function RecentlyViewed({ currentSlug }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [viewed, setViewed] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    ) as string[];

    setViewed(stored);

    async function load() {
      const data = await getProducts();
      setProducts(data);
    }

    load();
  }, []);

  const recentProducts = viewed
    .filter((slug) => slug !== currentSlug)
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product))
    .slice(0, 4);

  if (recentProducts.length === 0) return null;

  return (
    <section className="mt-24 scroll-mt-20 pb-16">
      <h2 className="mb-10 text-4xl font-bold">Recently Viewed</h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {recentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
