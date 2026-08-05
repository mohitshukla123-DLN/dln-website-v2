import { ChangeEvent, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateSKU() {
  return (
    "DLN-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );
}

export default function AddProductModal({
  open,
  onClose,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] =
    useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [images, setImages] = useState<
    File[]
  >([]);

  function handleImages(
    e: ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    setImages(Array.from(e.target.files));
  }

  if (!open) return null;

  async function saveProduct() {
    setLoading(true);

    const { error } = await supabase
      .from("products")
      .insert({
        name,
        slug: slugify(name),
        sku: generateSKU(),
        category,
        price: Number(price),
        stock: Number(stock),
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    onClose();
    window.location.reload();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8">
        <h2 className="mb-6 text-2xl font-bold">
          Add Product
        </h2>

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Product Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Stock"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
        />

        <div className="mb-6">
          <label className="mb-2 block font-medium">
            Product Images
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImages}
          />

          {images.length > 0 && (
            <div className="mt-3 space-y-1 rounded-lg border p-3 text-sm">
              {images.map((file) => (
                <div key={file.name}>
                  • {file.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={saveProduct}
            disabled={loading}
            className="rounded-lg bg-black px-5 py-2 text-white"
          >
            {loading
              ? "Saving..."
              : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}