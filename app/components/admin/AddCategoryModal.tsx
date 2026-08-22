import { useState } from "react";
import { supabase } from "../../lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AddCategoryModal({
  open,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  async function saveCategory() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Please enter a category name.");
      return;
    }

    setLoading(true);

    const slug = slugify(trimmedName);

    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      setLoading(false);
      alert("A category with this name already exists.");
      return;
    }

    const { data: lastCategory } = await supabase
      .from("categories")
      .select("sort_order")
      .order("sort_order", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    const nextSortOrder =
      (lastCategory?.sort_order ?? -1) + 1;

    const { error } = await supabase
      .from("categories")
      .insert({
        name: trimmedName,
        slug,
        description: description.trim() || null,
        enabled: true,
        sort_order: nextSortOrder,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setDescription("");

    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8">
        <h2 className="mb-2 text-2xl font-bold">
          Add Category
        </h2>

        <p className="mb-6 text-sm text-[var(--muted)]">
          Add a new product category.
        </p>

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="mb-6 w-full rounded-lg border p-3"
          rows={4}
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={saveCategory}
            disabled={loading}
            className="rounded-lg bg-[var(--burgundy)] px-5 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>
        </div>
      </div>
    </div>
  );
}