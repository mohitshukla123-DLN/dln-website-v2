import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { AdminProduct } from "../../types/adminProduct";
import type { Product } from "../../types/product";


interface Props {
  open: boolean;
  product: AdminProduct | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditProductModal({
  open,
  product,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [description, setDescription] = useState("");

  const [fabric, setFabric] = useState("");
  const [embroidery, setEmbroidery] = useState("");
  const [fit, setFit] = useState("");
  const [occasion, setOccasion] = useState("");
  const [care, setCare] = useState("");

  const [availability, setAvailability] = useState("In Stock");

  const [badge, setBadge] = useState("");

  const [featured, setFeatured] = useState(false);

  const [bestseller, setBestseller] = useState(false);

  const [newArrival, setNewArrival] = useState(false);

  useEffect(() => {
    if (!product) return;

      setName(product.name);

      setCategory(product.category);
      setSubcategory(product.subcategory ?? "");

      setPrice(product.price.toString());
      setStock((product.stock ?? 0).toString());

      setDescription(product.description ?? "");

      setFabric(product.fabric ?? "");
      setEmbroidery(product.embroidery ?? "");
      setFit(product.fit ?? "");
      setOccasion(product.occasion ?? "");
      setCare(product.care ?? "");

      setAvailability(
        product.availability ?? "In Stock"
      );

      setBadge(product.badge ?? "");

      setFeatured(product.featured);
      setBestseller(product.bestseller);
      setNewArrival(product.new_arrival ?? false);
  }, [product]);

  if (!open || !product) return null;

    async function saveChanges() {
    if (!product) return;

    setLoading(true);

    const { error } = await supabase
        .from("products")
        .update({
        name,
        category,
        price: Number(price),
        stock: Number(stock),
        featured,
        })
        .eq("id", product.id);

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
          Edit Product
        </h2>

        <input
          className="mb-4 w-full rounded-lg border p-3"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
        />

        <label className="mb-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) =>
              setFeatured(e.target.checked)
            }
          />

          Featured Product
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={saveChanges}
            disabled={loading}
            className="rounded-lg bg-black px-5 py-2 text-white"
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}