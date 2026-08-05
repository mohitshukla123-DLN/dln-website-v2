import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { AdminProduct } from "../../types/adminProduct";

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
          subcategory,

          price: Number(price),
          stock: Number(stock),

          description,

          fabric,
          embroidery,
          fit,
          occasion,
          care,

          availability,
          badge,

          featured,
          bestseller,
          new_arrival: newArrival,
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

        <select
          className="mb-4 w-full rounded-lg border p-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Kurti">Kurti</option>
          <option value="Saree">Saree</option>
          <option value="Sharara">Sharara</option>
          <option value="Co-ord Set">Co-ord Set</option>
          <option value="Lehenga">Lehenga</option>
          <option value="Gown">Gown</option>
          <option value="Jacket">Jacket</option>
        </select>

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

        <textarea
          className="mb-4 w-full rounded-lg border p-3"
          rows={5}
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            className="rounded-lg border p-3"
            placeholder="Fabric"
            value={fabric}
            onChange={(e)=>setFabric(e.target.value)}
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Embroidery"
            value={embroidery}
            onChange={(e)=>setEmbroidery(e.target.value)}
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Fit"
            value={fit}
            onChange={(e)=>setFit(e.target.value)}
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Occasion"
            value={occasion}
            onChange={(e)=>setOccasion(e.target.value)}
          />

        </div>

        <textarea
          className="mb-4 w-full rounded-lg border p-3"
          rows={3}
          placeholder="Care Instructions"
          value={care}
          onChange={(e)=>setCare(e.target.value)}
        />

        <select
          className="mb-4 w-full rounded-lg border p-3"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option>In Stock</option>
          <option>Made to Order</option>
          <option>Sold Out</option>
        </select>

        <select
          className="mb-4 w-full rounded-lg border p-3"
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
        >
          <option value="">No Badge</option>
          <option value="NEW">NEW</option>
          <option value="BESTSELLER">BESTSELLER</option>
          <option value="LIMITED">LIMITED</option>
          <option value="SALE">SALE</option>
        </select>

        <div className="mb-6 space-y-3">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured Product
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={bestseller}
              onChange={(e) => setBestseller(e.target.checked)}
            />
            Bestseller
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={newArrival}
              onChange={(e) => setNewArrival(e.target.checked)}
            />
            New Arrival
          </label>

        </div>

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