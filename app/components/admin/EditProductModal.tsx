import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  uploadProductImage,
  uploadProductVideo,
} from "../../lib/storage";
import type { AdminProduct } from "../../types/adminProduct";
import ProductImageCropper from "./ProductImageCropper";

interface Props {
  open: boolean;
  product: AdminProduct | null;
  onClose: () => void;
  onSaved: () => void;
}

interface CategoryOption {
  id: number;
  name: string;
  slug: string;
  enabled: boolean;
  sort_order: number;
}

interface SubcategoryOption {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  enabled: boolean;
  sort_order: number;
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

  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState<Record<string, string>>({
  "Free Size": "",
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
  const [productVideos, setProductVideos] = useState<string[]>([]);
  const [newVideoFiles, setNewVideoFiles] = useState<File[]>([]);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [categoryOptions, setCategoryOptions] =
  useState<CategoryOption[]>([]);

  const [subcategoryOptions, setSubcategoryOptions] =
    useState<SubcategoryOption[]>([]);

  useEffect(() => {
  if (!open) return;

  async function loadCategoryOptions() {
    const [{ data: categoryData, error: categoryError }, {
      data: subcategoryData,
      error: subcategoryError,
    }] = await Promise.all([
      supabase
        .from("categories")
        .select("id,name,slug,enabled,sort_order")
        .eq("enabled", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),

      supabase
        .from("subcategories")
        .select(
          "id,category_id,name,slug,enabled,sort_order"
        )
        .eq("enabled", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
    ]);

    if (categoryError) {
      alert(categoryError.message);
      return;
    }

    if (subcategoryError) {
      alert(subcategoryError.message);
      return;
    }

    setCategoryOptions(categoryData ?? []);
    setSubcategoryOptions(subcategoryData ?? []);
  }

  loadCategoryOptions();
}, [open]);

  useEffect(() => {
    if (!product) return;

      setName(product.name);

      setCategory(product.category);
      setSubcategory(product.subcategory ?? "");
      setColor(product.color ?? "");

      setPrice(product.price.toString());
      setSizes({
        "Free Size": String(product.sizes?.["Free Size"] ?? ""),
        "32": String(product.sizes?.["32"] ?? ""),
        "34": String(product.sizes?.["34"] ?? ""),
        "36": String(product.sizes?.["36"] ?? ""),
        "38": String(product.sizes?.["38"] ?? ""),
        "40": String(product.sizes?.["40"] ?? ""),
        "42": String(product.sizes?.["42"] ?? ""),
        "44": String(product.sizes?.["44"] ?? ""),
        "46": String(product.sizes?.["46"] ?? ""),
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

      setProductVideos(
        Array.isArray(product.videos)
          ? product.videos
          : []
      );

      setNewVideoFiles([]);
  }, [product]);

  const selectedCategory = categoryOptions.find(
      (item) => item.name === category
    );

    const availableSubcategories =
      selectedCategory
        ? subcategoryOptions.filter(
            (item) =>
              item.category_id === selectedCategory.id
          )
        : [];

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
    e.target.value = "";
    return;
  }

  const file = files[0];

  if (!file.type.startsWith("image/")) {
    alert(`Invalid image: ${file.name}`);
    e.target.value = "";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert(`Image must be under 10MB: ${file.name}`);
    e.target.value = "";
    return;
  }

  setCropFile(file);
  e.target.value = "";
}

function handleNewVideos(
      e: React.ChangeEvent<HTMLInputElement>
    ) {
      if (!e.target.files) return;

      const files = Array.from(e.target.files ?? []);

        setNewVideoFiles((current) => [
          ...current,
          ...files,
        ]);

      e.target.value = "";
    }

    function removeExistingVideo(index: number) {
      setProductVideos((current) =>
        current.filter((_, i) => i !== index)
      );
    }

    function removeNewVideo(index: number) {
      setNewVideoFiles((current) =>
        current.filter((_, i) => i !== index)
      );
    }


async function handleCroppedProductImage(file: File) {
  if (!product) return;

  setCropFile(null);
  setLoading(true);

  try {
    const result = await uploadProductImage({
      file,
      category,
      productName: name,
      color: "default",
      view: `edit-${productImages.length + 1}`,
      sku: product.sku ?? `product-${product.id}`,
    });

    setProductImages((current) => [
      ...current,
      result.url,
    ]);
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Image upload failed."
    );
  } finally {
    setLoading(false);
  }
}

async function saveChanges() {
      if (!product) return;

      setLoading(true);

      const uploadedVideos: string[] = [];

        try {
          for (const file of newVideoFiles) {
            const result = await uploadProductVideo({
              file,
              category,
              productName: name,
              sku: product.sku ?? `product-${product.id}`,
            });

            uploadedVideos.push(result.url);
          }
        } catch (error) {
          setLoading(false);

          alert(
            error instanceof Error
              ? error.message
              : "Video upload failed."
          );

          return;
        }

        const finalVideos = [
          ...productVideos,
          ...uploadedVideos,
        ];

      const { error } = await supabase
        .from("products")
        .update({
          name,
          category,
          subcategory,
          color: color.trim(),

          price: Number(price),
          stock: Object.values(sizes).reduce(
            (sum, value) => sum + Number(value || 0),
            0
          ),

          sizes,

          // Product images
          image: productImages[0] ?? null,
          images: productImages,
          videos: finalVideos,

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

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
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

            {categoryOptions.map((item) => (
              <option
                key={item.id}
                value={item.name}
              >
                {item.name}
              </option>
            ))}
          </select>

          <select
            className="mb-4 w-full rounded-lg border p-3 disabled:bg-gray-100"
            value={subcategory}
            onChange={(e) =>
              setSubcategory(e.target.value)
            }
            disabled={!category}
          >
            <option value="">
              {!category
                ? "Select Category First"
                : availableSubcategories.length > 0
                  ? "Select Subcategory"
                  : "No Subcategories Available"}
            </option>

            {availableSubcategories.map((item) => (
              <option
                key={item.id}
                value={item.name}
              >
                {item.name}
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

          <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold">
                Product Videos
              </h3>

              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                multiple
                onChange={handleNewVideos}
                disabled={loading}
                className="w-full cursor-pointer rounded-lg border-2 border-[var(--burgundy)] bg-[var(--burgundy)]/5 p-3 text-sm font-medium text-[var(--burgundy)] transition hover:bg-[var(--burgundy)]/10"
              />

              <p className="mt-2 text-xs text-gray-500">
                MP4, WebM or MOV • Maximum 100 MB per video
              </p>

              {productVideos.length > 0 && (
                <div className="mt-4 space-y-2">
                  {productVideos.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-sm text-[var(--burgundy)] underline"
                      >
                        Existing Video {index + 1}
                      </a>

                      <button
                        type="button"
                        onClick={() => removeExistingVideo(index)}
                        className="ml-3 rounded-lg bg-red-600 px-3 py-1 text-xs text-white"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {newVideoFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {newVideoFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <span className="truncate text-sm">
                        {file.name}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeNewVideo(index)}
                        className="ml-3 rounded-lg bg-red-600 px-3 py-1 text-xs text-white"
                      >
                        Remove
                      </button>
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

                {cropFile && (
          <ProductImageCropper
            file={cropFile}
            onDone={handleCroppedProductImage}
            onCancel={() => setCropFile(null)}
          />
        )}
      </div>
    </div>
  );
}