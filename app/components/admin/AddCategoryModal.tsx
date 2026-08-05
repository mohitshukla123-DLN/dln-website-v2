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

  const [description, setDescription] =
    useState("");

  if (!open) return null;

  async function saveCategory() {
    setLoading(true);

    const { error } = await supabase
      .from("categories")
      .insert({
        name,
        slug: slugify(name),
        description,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Add Category
        </h2>

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Category Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <textarea
          className="mb-6 w-full rounded-lg border p-3"
          rows={4}
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

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
            className="rounded-lg bg-black px-5 py-2 text-white"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>

        </div>

      </div>
    </div>
  );
}