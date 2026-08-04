import ProductGrid from "../shop/ProductGrid";

import { products } from "../../data/products";
import type { Product } from "../../types/product";

interface Props {
  currentProduct: Product;
}

export default function RelatedProducts({
  currentProduct,
}: Props) {
  const relatedProducts = products
    .filter(
      (product) =>
        product.id !== currentProduct.id &&
        product.category === currentProduct.category
    )
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-24">
      <h2 className="mb-8 text-3xl font-bold">
        You May Also Like
      </h2>

      <ProductGrid products={relatedProducts} />
    </section>
  );
}