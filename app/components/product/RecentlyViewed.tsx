import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { getProducts } from "../../lib/products";
import type { Product } from "../../types/product";

interface Props {
  currentSlug: string;
}

export default function RecentlyViewed({
  currentSlug,
}: Props) {
  const viewed = JSON.parse(
    localStorage.getItem("recentlyViewed") || "[]"
  ) as string[];

  const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
      async function load() {
        const data = await getProducts();
        setProducts(data);
      }

      load();
    }, []);

  const recentProducts = viewed
    .filter((slug) => slug !== currentSlug)
    .map((slug) =>
      products.find((p) => p.slug === slug)
    )
    .filter(Boolean)
    .slice(0, 4);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-24">
      <h2 className="mb-8 text-3xl font-bold">
        Recently Viewed
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {recentProducts.map((product) => (
          <ProductCard
            key={product!.id}
            product={product!}
          />
        ))}
      </div>
    </section>
  );
}