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
  const [sizes, setSizes] = useState({
  "32": "",
  "34": "",
  "36": "",
  "38": "",
  "40": "",
  "42": "",
  "44": "",
  "46": "",
});

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
  const [image, setImage] = useState("");
  const [libraryImages, setLibraryImages] = useState<string[]>([]);

  useEffect(() => {
    if (!product) return;

      setName(product.name);

      setCategory(product.category);
      setSubcategory(product.subcategory ?? "");

      setPrice(product.price.toString());
      setSizes({
          "32": product.sizes?.["32"] ?? "",
          "34": product.sizes?.["34"] ?? "",
          "36": product.sizes?.["36"] ?? "",
          "38": product.sizes?.["38"] ?? "",
          "40": product.sizes?.["40"] ?? "",
          "42": product.sizes?.["42"] ?? "",
          "44": product.sizes?.["44"] ?? "",
          "46": product.sizes?.["46"] ?? "",
        });

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
      setImage(product.image ?? "");
      loadLibraryImages();
  }, [product]);

    async function loadLibraryImages() {
    const { data } = await supabase.storage
      .from("media-library")
      .list("", { limit: 200 });

    if (!data) return;

    setLibraryImages(
      data.map(
        (file) =>
          supabase.storage
            .from("media-library")
            .getPublicUrl(file.name).data.publicUrl
      )
    );
  }

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
          stock: Object.values(sizes).reduce(
            (sum, value) => sum + Number(value || 0),
            0),

          sizes,
          image,

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

          updated_at: new Date().toISOString(),
        })
        .eq("id", product.id);

      setLoading(false);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Product Updated");

      onSaved();
      onClose();
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-8">
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

        <div className="mb-4 grid grid-cols-4 gap-3">
          {Object.entries(sizes).map(([size, qty]) => (
            <div key={size}>
              <label className="mb-1 block text-sm font-medium">
                {size}
              </label>

              <input
                type="number"
                min="0"
                value={qty}
                onChange={(e) =>
                  setSizes({
                    ...sizes,
                    [size]: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-2"
              />
            </div>
          ))}
        </div>

        <label className="mb-2 block font-medium">
            Product Image
          </label>

          {image && (
            <img
              src={image}
              alt=""
              className="mb-4 h-40 rounded-lg border object-cover"
            />
          )}

          <div className="mb-6 grid grid-cols-4 gap-3 max-h-64 overflow-y-auto rounded-lg border p-3">

            {libraryImages.map((url) => (

              <img
                key={url}
                src={url}
                alt=""
                onClick={() => setImage(url)}
                className={`h-20 w-full cursor-pointer rounded-lg object-cover border-2 transition
                  ${
                    image === url
                      ? "border-black"
                      : "border-transparent"
                  }`}
              />

            ))}

          </div>


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