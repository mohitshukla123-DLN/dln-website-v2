import { useEffect, useState } from "react";

import Container from "../../components/ui/Container";
import AddProductModal from "../../components/admin/AddProductModal";
import EditProductModal from "../../components/admin/EditProductModal";


import { supabase } from "../../lib/supabase";
import type { Product } from "../../types/product";
import type { AdminProduct } from "../../types/adminProduct";

export default function AdminProductsPage() {
  const [open, setOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] =
  useState<AdminProduct | null>(null);

  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<AdminProduct[]>([]);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select(`
              id,
              name,
              slug,
              sku,
              category,
              subcategory,
              price,
              stock,
              featured,
              bestseller,
              new_arrival,
              badge,
              availability,
              description,
              fabric,
              embroidery,
              fit,
              occasion,
              care,
              sizes,
              image,
              created_at,
              updated_at
            `)
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setProducts(data);
    }

    setLoading(false);
  }

          async function deleteProduct(id: number) {
          const confirmed = window.confirm(
            "Delete this product?"
          );

          if (!confirmed) return;

          const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

          if (error) {
            alert(error.message);
            return;
          }

          loadProducts();
        }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Container>
      <section className="py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Product Management
            </h1>

            <p className="mt-2 text-[var(--muted)]">
              Manage products, pricing and inventory.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-[var(--teal)] px-6 py-3 font-semibold text-white"
          >
            + Add Product
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">
                  Image
                </th>

                <th className="p-4 text-left">
                  Product
                </th>

                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Price
                </th>

                <th className="p-4 text-left">
                  Stock
                </th>

                <th className="p-4 text-left">
                  Featured
                </th>
                <th className="p-4 text-left">
                  Description
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              )}

              {!loading &&
                products.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-10 text-center"
                    >
                      No products found
                    </td>
                  </tr>
                )}

              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-xs">
                        No Image
                      </div>
                    )}
                  </td>

                  <td className="p-4 font-medium">
                    {product.name}
                  </td>

                  <td className="p-4">
                    {product.category}
                  </td>

                  <td className="p-4">
                    ₹{product.price}
                  </td>

                  <td className="p-4">
                    {product.stock}
                  </td>

                  <td className="p-4">
                    {product.featured
                      ? "✅"
                      : "—"}
                  </td>
                  <td className="p-4">
                    {product.description}
                  </td>

                  <td className="space-x-2 p-4">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setEditOpen(true);
                      }}
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AddProductModal
          open={open}
          onClose={() => {
            setOpen(false);
            loadProducts();
          }}
        />

          <EditProductModal
            open={editOpen}
            product={selectedProduct}
            onClose={() => setEditOpen(false)}
            onSaved={loadProducts}
          />

      </section>
    </Container>
  );
}