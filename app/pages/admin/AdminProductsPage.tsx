import { useEffect, useState } from "react";

import Container from "../../components/ui/Container";

import AddProductModal from "../../components/admin/AddProductModal";
import ProductTable from "../../components/admin/ProductTable";

import { getProducts } from "../../lib/products";
import type { Product } from "../../types/product";

export default function AdminProductsPage() {
  const [open, setOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    const data = await getProducts();

    setProducts(data);

    setLoading(false);
  }

  return (
    <Container>
      <section className="py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Product Management
            </h1>

            <p className="mt-3 text-[var(--muted)]">
              Add, edit and manage products.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-[var(--teal)] px-6 py-3 font-semibold text-white"
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <ProductTable products={products} />
        )}
      </section>

      <AddProductModal
        open={open}
        onClose={() => {
          setOpen(false);
          loadProducts();
        }}
      />
    </Container>
  );
}