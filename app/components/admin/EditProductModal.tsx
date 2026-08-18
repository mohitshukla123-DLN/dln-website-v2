import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { uploadProductImage } from "../../lib/storage";
import type { AdminProduct } from "../../types/adminProduct";
import { categories } from "../../data/categories";
import { subcategories } from "../../data/subcategories";

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
  const [productImages, setProductImages] = useState<string[]>([]);

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

      setAvailability(product.availability ?? "In Stock");

      setBadge(product.badge ?? "");

      setFeatured(product.featured);
      setBestseller(product.bestseller);
      setNewArrival(product.new_arrival ?? false);

      setProductImages(
          Array.isArray(product.images)
            ? product.images
            : product.image
              ? [product.image]
              : []
        );
  }, [product]);

  const categoryKey = category
  .toLowerCase()
  .replace(/\s+/g, "-");

  if (!open || !product) return null;

  function removeProductImage(index: number) {
  setProductImages((current) =>
    current.filter((_, imageIndex) => imageIndex !== index)
  );
}

function setPrimaryImage(index: number) {
  setProductImages((current) => {
    if (index === 0) return current;

    const updated = [...current];
    const [primary] = updated.splice(index, 1);

    return [primary, ...updated];
  });
}

async function uploadNewProductImages(
  e: React.ChangeEvent<HTMLInputElement>
) {
  if (!e.target.files?.length || !product) return;

  const files = Array.from(e.target.files);

  if (productImages.length + files.length > 8) {
    alert("You can have a maximum of 8 product images.");
    return;
  }

  setLoading(true);

  try {
    const uploaded: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        throw new Error(`Invalid image: ${file.name}`);
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`Image must be under 10MB: ${file.name}`);
      }

      const result = await uploadProductImage({
        file,
        category,
        productName: name,
        color: "default",
        view: `edit-${productImages.length + uploaded.length + 1}`,
        sku: product.sku ?? `product-${product.id}`,
      });

      uploaded.push(result.url);
    }

    setProductImages((current) => [...current, ...uploaded]);
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Image upload failed."
    );
  } finally {
    setLoading(false);
    e.target.value = "";
  }
}

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
            0
          ),

          sizes,

          // Product images
          image: productImages[0] ?? null,
          images: productImages,

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
        onChange={(e) => {
          setCategory(e.target.value);
          setSubcategory("");
        }}
      >
        <option value="">Select Category</option>

        {categories.map((item) => (
          <option
            key={item.slug}
            value={item.name}
          >
            {item.name}
          </option>
        ))}
      </select>

      <select
          className="mb-4 w-full rounded-lg border p-3"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          disabled={!category}
        >
          <option value="">
            {category
              ? "Select Subcategory"
              : "Select Category First"}
          </option>

          {category &&
            subcategories[
              category
                .toLowerCase()
                .replace(/\s+/g, "-") as keyof typeof subcategories
            ]?.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
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

        <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold">
              Product Images
            </h3>

            <label
                htmlFor="edit-product-images"
                className="inline-flex cursor-pointer rounded-lg bg-[var(--burgundy)] px-5 py-3 font-medium text-white"
              >
                Upload New Images
              </label>

              <input
                id="edit-product-images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={uploadNewProductImages}
                disabled={loading}
                className="hidden"
              />

            {productImages.length === 0 ? (
              <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                No product images.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {productImages.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="rounded-xl border bg-white p-2"
                  >
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="mb-2 h-32 w-full rounded-lg object-cover"
                    />

                    <div className="mb-2 text-xs font-medium text-gray-500">
                      {index === 0 ? "Primary Image" : `Image ${index + 1}`}
                    </div>

                    <div className="flex gap-2">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className="flex-1 rounded-lg border px-2 py-1 text-xs"
                        >
                          Set Primary
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeProductImage(index)}
                        className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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