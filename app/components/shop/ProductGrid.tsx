import { useState } from "react";

import ProductCard from "../product/ProductCard";
import ProductQuickView from "../product/ProductQuickView";

import type { Product } from "../../types/product";

interface Props {
  products: Product[];
}

export default function ProductGrid({
  products,
}: Props) {
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [quickViewOpen, setQuickViewOpen] =
    useState(false);

  function openQuickView(product: Product) {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  }

  function closeQuickView() {
    setQuickViewOpen(false);
    setSelectedProduct(null);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={openQuickView}
          />
        ))}
      </div>

      <ProductQuickView
        product={selectedProduct}
        open={quickViewOpen}
        onClose={closeQuickView}
      />
    </>
  );
}