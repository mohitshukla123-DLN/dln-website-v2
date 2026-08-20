import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import { supabase } from "../../lib/supabase";
import AddCategoryModal from "../../components/admin/AddCategoryModal";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  enabled: boolean;
  sort_order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  async function loadCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setCategories(data ?? []);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function toggleEnabled(category: Category) {
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

  async function deleteCategory(category: Category) {
    const confirmed = window.confirm(
      `Delete "${category.name}"?`
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

  return (
    <Container>
      <section className="py-16">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Categories
            </h1>

            <p className="mt-2 text-[var(--muted)]">
              Manage product categories
            </p>
          </div>

          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="rounded-xl bg-black px-5 py-3 text-white"
          >
            + Add Category
          </button>
        </div>

        {/* Category Table */}
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Slug
                </th>

                <th className="p-4 text-left">
                  Sort
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
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t"
                >
                  <td className="p-4 font-medium">
                    {category.name}
                  </td>

                  <td className="p-4 text-sm text-[var(--muted)]">
                    {category.slug}
                  </td>

                  <td className="p-4">
                    {category.sort_order}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        toggleEnabled(category)
                      }
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
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

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(category);
                          setOpen(true);
                        }}
                        className="rounded-lg border px-3 py-2 text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteCategory(category)
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-[var(--muted)]"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Category Management Guide */}
        <div className="mt-6 rounded-xl border bg-gray-50 p-5">
          <h2 className="text-lg font-semibold">
            Category Management Guide
          </h2>

          <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            <p>
              <strong className="text-[var(--foreground)]">
                Name:
              </strong>{" "}
              The category name visitors see on the website.
            </p>

            <p>
              <strong className="text-[var(--foreground)]">
                Slug:
              </strong>{" "}
              The URL-friendly version of the category name.
              For example, “Designer Sarees” becomes
              “designer-sarees”. This is normally generated
              automatically and should not need manual editing.
            </p>

            <p>
              <strong className="text-[var(--foreground)]">
                Sort Order:
              </strong>{" "}
              Controls the display order of categories.
              Lower numbers appear first. For example,
              Sort 1 appears before Sort 2, Sort 3, and so on.
            </p>

            <p>
              <strong className="text-[var(--foreground)]">
                Enabled:
              </strong>{" "}
              Controls whether the category is active.
              Disable a category when you do not want it
              available on the website without deleting it.
            </p>

            <p>
              <strong className="text-[var(--foreground)]">
                Edit:
              </strong>{" "}
              Use Edit to change the category name,
              description, sort order, or enabled status.
            </p>

            <p>
              <strong className="text-[var(--foreground)]">
                Delete:
              </strong>{" "}
              Permanently removes the category. Use this
              only when the category is no longer required.
            </p>
          </div>
        </div>
      </section>

      <AddCategoryModal
        open={open}
        category={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSaved={loadCategories}
      />
    </Container>
  );
}