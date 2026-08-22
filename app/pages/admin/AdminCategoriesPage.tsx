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

interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  enabled: boolean;
  sort_order: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] =
    useState<Subcategory[]>([]);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [expanded, setExpanded] = useState<
    number | null
  >(null);

  const [newSubcategory, setNewSubcategory] =
    useState("");

  const [savingSubcategory, setSavingSubcategory] =
    useState(false);

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

    const { data: subcategoryData, error: subcategoryError } =
      await supabase
        .from("subcategories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

    if (subcategoryError) {
      alert(subcategoryError.message);
      setLoading(false);
      return;
    }

    setSubcategories(subcategoryData ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function getSubcategories(categoryId: number) {
    return subcategories
      .filter(
        (item) => item.category_id === categoryId
      )
      .sort(
        (a, b) =>
          a.sort_order - b.sort_order ||
          a.name.localeCompare(b.name)
      );
  }

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
      `Delete "${category.name}"? This will also delete its subcategories. This cannot be undone.`
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

  async function addSubcategory(
    categoryId: number
  ) {
    const trimmedName =
      newSubcategory.trim();

    if (!trimmedName) {
      alert("Please enter a subcategory name.");
      return;
    }

    setSavingSubcategory(true);

    const slug = slugify(trimmedName);

    const { data: existing } = await supabase
      .from("subcategories")
      .select("id")
      .eq("category_id", categoryId)
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      setSavingSubcategory(false);
      alert(
        "This subcategory already exists under this category."
      );
      return;
    }

    const existingSubcategories =
      getSubcategories(categoryId);

    const nextSortOrder =
      existingSubcategories.length > 0
        ? Math.max(
            ...existingSubcategories.map(
              (item) => item.sort_order
            )
          ) + 1
        : 0;

    const { error } = await supabase
      .from("subcategories")
      .insert({
        category_id: categoryId,
        name: trimmedName,
        slug,
        enabled: true,
        sort_order: nextSortOrder,
      });

    setSavingSubcategory(false);

    if (error) {
      alert(error.message);
      return;
    }

    setNewSubcategory("");
    await loadCategories();
  }

  async function toggleSubcategory(
    subcategory: Subcategory
  ) {
    const { error } = await supabase
      .from("subcategories")
      .update({
        enabled: !subcategory.enabled,
      })
      .eq("id", subcategory.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadCategories();
  }

  async function deleteSubcategory(
    subcategory: Subcategory
  ) {
    const confirmed = window.confirm(
      `Delete "${subcategory.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", subcategory.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadCategories();
  }

  async function moveSubcategory(
    categoryId: number,
    index: number,
    direction: "up" | "down"
  ) {
    const items = getSubcategories(categoryId);

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= items.length
    ) {
      return;
    }

    const first = items[index];
    const second = items[targetIndex];

    await Promise.all([
      supabase
        .from("subcategories")
        .update({
          sort_order: targetIndex,
        })
        .eq("id", first.id),

      supabase
        .from("subcategories")
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
              Manage categories, subcategories,
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
            <div>
              {categories.map(
                (category, index) => {
                  const items =
                    getSubcategories(category.id);

                  const isExpanded =
                    expanded === category.id;

                  return (
                    <div
                      key={category.id}
                      className="border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-4 p-4">
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
                        </div>

                        <button
                          type="button"
                          onClick={() => {
  console.log("EXPAND CLICK", category.id, category.name);
  setExpanded(isExpanded ? null : category.id);
}}
                          className="flex-1 text-left"
                        >
                          <div className="font-semibold">
                            {category.name}
                          </div>

                          <div className="text-sm text-[var(--muted)]">
                            {category.slug} ·{" "}
                            {items.length}{" "}
                            subcategor
                            {items.length === 1
                              ? "y"
                              : "ies"}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleEnabled(category)
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

                        <button
                          type="button"
                          onClick={() =>
                            deleteCategory(category)
                          }
                          className="rounded-lg border px-3 py-2 text-xs text-red-600"
                        >
                          Delete
                        </button>

                        <span className="text-xl">
                          {isExpanded ? "⌃" : "⌄"}
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="bg-gray-50 px-6 pb-6 pt-2">
                          <div className="mb-4 flex gap-2">
                            <input
                              value={newSubcategory}
                              onChange={(e) =>
                                setNewSubcategory(
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter"
                                ) {
                                  addSubcategory(
                                    category.id
                                  );
                                }
                              }}
                              placeholder={`Add subcategory to ${category.name}`}
                              className="flex-1 rounded-lg border bg-white p-3"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                addSubcategory(
                                  category.id
                                )
                              }
                              disabled={
                                savingSubcategory
                              }
                              className="rounded-lg bg-[var(--burgundy)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                            >
                              {savingSubcategory
                                ? "Saving..."
                                : "+ Add"}
                            </button>
                          </div>

                          {items.length === 0 ? (
                            <div className="rounded-lg border bg-white p-4 text-sm text-[var(--muted)]">
                              No subcategories yet.
                            </div>
                          ) : (
                            <div className="overflow-hidden rounded-lg border bg-white">
                              {items.map(
                                (
                                  subcategory,
                                  subIndex
                                ) => (
                                  <div
                                    key={
                                      subcategory.id
                                    }
                                    className="flex items-center gap-3 border-b p-3 last:border-b-0"
                                  >
                                    <div className="flex gap-1">
                                      <button
                                        type="button"
                                        disabled={
                                          subIndex ===
                                          0
                                        }
                                        onClick={() =>
                                          moveSubcategory(
                                            category.id,
                                            subIndex,
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
                                          subIndex ===
                                          items.length -
                                            1
                                        }
                                        onClick={() =>
                                          moveSubcategory(
                                            category.id,
                                            subIndex,
                                            "down"
                                          )
                                        }
                                        className="rounded border px-2 py-1 text-xs disabled:opacity-30"
                                      >
                                        ↓
                                      </button>
                                    </div>

                                    <div className="flex-1">
                                      <div className="font-medium">
                                        {
                                          subcategory.name
                                        }
                                      </div>

                                      <div className="text-xs text-[var(--muted)]">
                                        {
                                          subcategory.slug
                                        }
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleSubcategory(
                                          subcategory
                                        )
                                      }
                                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        subcategory.enabled
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-500"
                                      }`}
                                    >
                                      {subcategory.enabled
                                        ? "Enabled"
                                        : "Disabled"}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteSubcategory(
                                          subcategory
                                        )
                                      }
                                      className="rounded-lg border px-3 py-2 text-xs text-red-600"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
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
                Category:
              </strong>{" "}
              Controls the main product category.
            </p>

            <p>
              <strong className="text-black">
                Subcategory:
              </strong>{" "}
              Expand a category to add, remove,
              enable, disable or reorder its
              subcategories.
            </p>

            <p>
              <strong className="text-black">
                Enabled:
              </strong>{" "}
              Disabled categories and subcategories
              remain in the database but can be
              excluded from the storefront.
            </p>

            <p>
              <strong className="text-black">
                Delete:
              </strong>{" "}
              Deleting a category also deletes its
              subcategories.
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