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
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const productsPerPage = 10;

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
            color,
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
            images,
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

  useEffect(() => {
  setCurrentPage(1);
}, [search, categoryFilter, statusFilter, sortBy]);

  const filteredProducts = [...products]
  .filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()) ||
      (product.sku ?? "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      product.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Featured" && product.featured) ||
      (statusFilter === "Bestseller" && product.bestseller) ||
      (statusFilter === "New Arrival" && product.new_arrival) ||
      (statusFilter === "Sold Out" && product.stock === 0) ||
      (statusFilter === "Low Stock" &&
        product.stock > 0 &&
        product.stock <= 2);

    return matchesSearch && matchesCategory && matchesStatus;
  })
  .sort((a, b) => {
    switch (sortBy) {
      case "Price Low":
        return a.price - b.price;

      case "Price High":
        return b.price - a.price;

      case "Stock":
        return b.stock - a.stock;

      case "Name":
        return a.name.localeCompare(b.name);

      default:
        return (
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
        );
    }
  });

const totalPages = Math.ceil(
  filteredProducts.length / productsPerPage
);

const paginatedProducts = filteredProducts.slice(
  (currentPage - 1) * productsPerPage,
  currentPage * productsPerPage
);

function toggleProductSelection(id: number) {
  setSelectedProducts((current) =>
    current.includes(id)
      ? current.filter((productId) => productId !== id)
      : [...current, id]
  );
}

function toggleSelectAll() {
  const pageIds = paginatedProducts.map((product) => product.id);

  const allSelected = pageIds.every((id) =>
    selectedProducts.includes(id)
  );

  if (allSelected) {
    setSelectedProducts((current) =>
      current.filter((id) => !pageIds.includes(id))
    );
  } else {
    setSelectedProducts((current) => [
      ...new Set([...current, ...pageIds]),
    ]);
  }
}

async function bulkUpdate(
  field: "featured" | "bestseller" | "new_arrival",
  value: boolean
) {
  if (selectedProducts.length === 0) return;

  const { error } = await supabase
    .from("products")
    .update({ [field]: value })
    .in("id", selectedProducts);

  if (error) {
    alert(error.message);
    return;
  }

  setSelectedProducts([]);
  await loadProducts();
}

async function bulkDelete() {
  if (selectedProducts.length === 0) return;

  const confirmed = window.confirm(
    `Delete ${selectedProducts.length} selected product${
      selectedProducts.length !== 1 ? "s" : ""
    }?\n\nThis action cannot be undone.`
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .in("id", selectedProducts);

  if (error) {
    alert(error.message);
    return;
  }

  setSelectedProducts([]);
  await loadProducts();
}


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
            className="rounded-xl bg-[var(--burgundy)] px-6 py-3 font-semibold text-white"
          >
            + Add Product
          </button>
        </div>

        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border p-3"
          />

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="rounded-xl border p-3"
          >
            <option>All</option>
            <option>Kurti</option>
            <option>Saree</option>
            <option>Sharara</option>
            <option>Co-ord Set</option>
            <option>Lehenga</option>
            <option>Gown</option>
            <option>Jacket</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border p-3"
          >
            <option>All Status</option>
            <option>In Stock</option>
            <option>Made to Order</option>
            <option>Sold Out</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border p-3"
          >
            <option>Newest</option>
            <option>Name</option>
            <option>Price Low</option>
            <option>Price High</option>
            <option>Stock</option>
          </select>

        </div>

        {selectedProducts.length > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-xl border bg-white p-4">
              <span className="font-medium">
                {selectedProducts.length} product
                {selectedProducts.length !== 1 ? "s" : ""} selected
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => bulkUpdate("featured", true)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Mark Featured
                </button>

                <button
                  onClick={() => bulkUpdate("featured", false)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Remove Featured
                </button>

                <button
                  onClick={() => bulkUpdate("bestseller", true)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Mark Bestseller
                </button>

                <button
                  onClick={() => bulkUpdate("bestseller", false)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Remove Bestseller
                </button>

                <button
                  onClick={() => bulkUpdate("new_arrival", true)}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Mark New Arrival
                </button>

                <button
                  onClick={() => bulkUpdate("new_arrival", false)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Remove New Arrival
                </button>

                <button
                  onClick={() => setSelectedProducts([])}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Clear Selection
                </button>

                <button
                  onClick={() => bulkUpdate("new_arrival", true)}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Mark New Arrival
                </button>

                <button
                  onClick={() => bulkUpdate("new_arrival", false)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Remove New Arrival
                </button>

                <button
                  onClick={bulkDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Delete Selected
                </button>

                <button
                  onClick={() => setSelectedProducts([])}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Clear Selection
                </button>

              </div>
            </div>
          )}

        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        paginatedProducts.length > 0 &&
                        paginatedProducts.every((product) =>
                          selectedProducts.includes(product.id)
                        )
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
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
                  Status
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
                    colSpan={8}
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
                      colSpan={8}
                      className="p-10 text-center"
                    >
                      No products found
                    </td>
                  </tr>
                )}

              {paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                    />
                  </td>
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
                    {product.stock === 0 ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        Sold Out
                      </span>
                    ) : product.stock <= 2 ? (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        Low Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        In Stock ({product.stock})
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {product.featured
                      ? "✅"
                      : "—"}
                  </td>
                  
                  <td className="p-4">
                    <div className="space-y-1 text-sm">
                      {product.featured && (
                        <div className="rounded bg-green-100 px-2 py-1 text-green-700">
                          Featured
                        </div>
                      )}

                      {product.bestseller && (
                        <div className="rounded bg-blue-100 px-2 py-1 text-blue-700">
                          Bestseller
                        </div>
                      )}

                      {product.new_arrival && (
                        <div className="rounded bg-purple-100 px-2 py-1 text-purple-700">
                          New Arrival
                        </div>
                      )}

                      {!product.featured &&
                        !product.bestseller &&
                        !product.new_arrival && (
                          <span className="text-gray-400">—</span>
                        )}
                    </div>
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