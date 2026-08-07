import { useEffect, useState } from "react";

import ProductGrid from "../shop/ProductGrid";

import { getProducts } from "../../lib/products";
import type { Product } from "../../types/product";

interface Props {
  currentProduct: Product;
}

export default function RelatedProducts({
  currentProduct,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }

    load();
  }, []);

  const relatedProducts = products
    .filter(
      (product) =>
        product.id !== currentProduct.id &&
        product.category === currentProduct.category
    )
    .slice(0, 4);

  if (loading) {
    return null;
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-24">
      <h2 className="mb-10 text-4xl font-bold">
        You May Also Like
      </h2>

      <ProductGrid products={relatedProducts} />
    </section>
  );
}