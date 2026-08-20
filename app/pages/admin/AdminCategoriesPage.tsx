import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import { supabase } from "../../lib/supabase";
import AddCategoryModal from "../../components/admin/AddCategoryModal";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  enabled: boolean;
  sort_order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadCategories() {
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setCategories(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function toggleEnabled(
    category: Category
  ) {
    const { error } = await supabase
      .from("categories")
      .update({
        enabled: !category.enabled,
      })
      .eq("id", category.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadCategories();
  }

  async function deleteCategory(
    category: Category
  ) {
    const confirmed = window.confirm(
      `Delete "${category.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadCategories();
  }

  async function moveCategory(
    index: number,
    direction: "up" | "down"
  ) {
    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= categories.length
    ) {
      return;
    }

    const current = [...categories];

    const first = current[index];
    const second = current[targetIndex];

    current[index] = second;
    current[targetIndex] = first;

    setCategories(current);

    await Promise.all([
      supabase
        .from("categories")
        .update({
          sort_order: targetIndex,
        })
        .eq("id", first.id),

      supabase
        .from("categories")
        .update({
          sort_order: index,
        })
        .eq("id", second.id),
    ]);

    loadCategories();
  }

  return (
    <Container>
      <section className="py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">
              Categories
            </h1>

            <p className="mt-2 text-[var(--muted)]">
              Manage product categories,
              visibility and display order.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-[var(--burgundy)] px-5 py-3 font-medium text-white"
          >
            + Add Category
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white">
          {loading ? (
            <div className="p-8 text-center text-[var(--muted)]">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted)]">
              No categories found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">
                      Order
                    </th>

                    <th className="p-4 text-left">
                      Name
                    </th>

                    <th className="p-4 text-left">
                      Slug
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map(
                    (category, index) => (
                      <tr
                        key={category.id}
                        className="border-t"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() =>
                                moveCategory(
                                  index,
                                  "up"
                                )
                              }
                              className="rounded border px-2 py-1 text-xs disabled:opacity-30"
                            >
                              ↑
                            </button>

                            <button
                              type="button"
                              disabled={
                                index ===
                                categories.length - 1
                              }
                              onClick={() =>
                                moveCategory(
                                  index,
                                  "down"
                                )
                              }
                              className="rounded border px-2 py-1 text-xs disabled:opacity-30"
                            >
                              ↓
                            </button>

                            <span className="ml-2 text-sm text-[var(--muted)]">
                              {category.sort_order}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 font-medium">
                          {category.name}
                        </td>

                        <td className="p-4 text-sm text-[var(--muted)]">
                          {category.slug}
                        </td>

                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() =>
                              toggleEnabled(
                                category
                              )
                            }
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              category.enabled
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {category.enabled
                              ? "Enabled"
                              : "Disabled"}
                          </button>
                        </td>

                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              deleteCategory(
                                category
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-xs text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            Categories Guide
          </h2>

          <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <p>
              <strong className="text-black">
                Slug:
              </strong>{" "}
              The URL-friendly identifier used for
              category links. Example:
              <span className="ml-1 font-medium text-black">
                sarees
              </span>
              .
            </p>

            <p>
              <strong className="text-black">
                Sort:
              </strong>{" "}
              Controls the order in which categories
              appear. Use ↑ and ↓ to move a category.
            </p>

            <p>
              <strong className="text-black">
                Enabled:
              </strong>{" "}
              Controls whether the category is active
              on the website. Disabled categories can
              remain in the database without being
              publicly displayed.
            </p>

            <p>
              <strong className="text-black">
                Delete:
              </strong>{" "}
              Permanently removes the category.
              Use this only when the category is no
              longer required.
            </p>
          </div>
        </div>
      </section>

      <AddCategoryModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={loadCategories}
      />
    </Container>
  );
}