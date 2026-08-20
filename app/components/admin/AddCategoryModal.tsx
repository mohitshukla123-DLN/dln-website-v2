import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  enabled: boolean;
  sort_order: number;
}

interface Props {
  open: boolean;
  category?: Category | null;
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
  category,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!open) return;

    setName(category?.name ?? "");
    setDescription(category?.description ?? "");
    setSortOrder(String(category?.sort_order ?? 0));
    setEnabled(category?.enabled ?? true);
  }, [open, category]);

  if (!open) return null;

  async function saveCategory() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Please enter the category name.");
      return;
    }

    const slug = slugify(trimmedName);

    if (!slug) {
      alert("Please enter a valid category name.");
      return;
    }

    setLoading(true);

    const payload = {
      name: trimmedName,
      slug,
      description: description.trim() || null,
      sort_order: Number(sortOrder) || 0,
      enabled,
    };

    const result = category
      ? await supabase
          .from("categories")
          .update(payload)
          .eq("id", category.id)
      : await supabase
          .from("categories")
          .insert(payload);

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8">
        <h2 className="mb-6 text-2xl font-bold">
          {category
            ? "Edit Category"
            : "Add Category"}
        </h2>

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Category Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <textarea
          className="mb-4 w-full rounded-lg border p-3"
          rows={4}
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <input
          type="number"
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Sort Order"
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value)
          }
        />

        <label className="mb-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) =>
              setEnabled(e.target.checked)
            }
          />

          <span className="text-sm font-medium">
            Enabled
          </span>
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={saveCategory}
            disabled={loading}
            className="rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : category
                ? "Update Category"
                : "Save Category"}
          </button>
        </div>
      </div>
    </div>
  );
}