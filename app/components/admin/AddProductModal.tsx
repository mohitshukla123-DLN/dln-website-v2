import { ChangeEvent, useState } from "react";
import { supabase } from "../../lib/supabase";
import { uploadProductImage } from "../../lib/storage";
import { categories } from "../../data/categories";
import { subcategories } from "../../data/subcategories";

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

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
          "image/jpeg",
          "image/png",
          "image/webp",
        ];

const IMAGE_VIEW_OPTIONS = [
  "front",
  "back",
  "side",
  "detail",
];

export default function AddProductModal({
  open,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [color, setColor] = useState("");
  const [sku, setSku] = useState("");

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

  const [availability, setAvailability] =
    useState("In Stock");

  const [badge, setBadge] = useState("");

  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);

  const [images, setImages] = useState<File[]>([]);
  const [imageViews, setImageViews] = useState<string[]>([]);

  function handleImages(e: ChangeEvent<HTMLInputElement>) {
  if (!e.target.files) return;

  const selectedImages = Array.from(e.target.files);

  setImages(selectedImages);

  setImageViews(
    selectedImages.map((_, index) =>
      index === 0 ? "front" : "back"
    )
  );
}

  if (!open) return null;

  const categoryKey = category
  .toLowerCase()
  .replace(/\s+/g, "-");

async function saveProduct() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    alert("Not logged in");
    return;
  }

  const trimmedName = name.trim();
  const numericPrice = Number(price);

  if (!trimmedName) {
    alert("Product name is required.");
    return;
  }

  if (!category) {
    alert("Please select a category.");
    return;
  }

  if (!color.trim()) {
  alert("Please enter the product color.");
  return;
  }

  const trimmedSKU = sku.trim().toUpperCase();

if (!trimmedSKU) {
  alert("Please enter the product SKU.");
  return;
}

if (!/^[A-Z0-9-]+$/.test(trimmedSKU)) {
  alert(
    "SKU may contain only letters, numbers, and hyphens."
  );
  return;
}

  if (category && subcategories[
    categoryKey as keyof typeof subcategories
  ]?.length > 0 && !subcategory) {
    alert("Please select a subcategory.");
    return;
  }

  if (!price || !Number.isFinite(numericPrice) || numericPrice <= 0) {
    alert("Please enter a valid price greater than 0.");
    return;
  }

  if (images.length === 0) {
    alert("Please upload at least one product image.");
    return;
  }

  const invalidImage = images.find(
        (file) =>
          !ALLOWED_IMAGE_TYPES.includes(file.type) ||
          file.size > MAX_IMAGE_SIZE
      );

      if (invalidImage) {
        if (!ALLOWED_IMAGE_TYPES.includes(invalidImage.type)) {
          alert(
            `${invalidImage.name} is not a supported image type. Use JPG, PNG, or WEBP.`
          );
        } else {
          alert(
            `${invalidImage.name} is too large. Maximum image size is 10 MB.`
          );
        }

        return;
      }

  const stock = Object.values(sizes).reduce(
    (total, value) => total + Number(value || 0),
    0
  );

  if (stock <= 0) {
    alert("Please enter stock quantity for at least one size.");
    return;
  }

  if (!description.trim()) {
    alert("Product description is required.");
    return;
  }

  const { data: existingSKU, error: skuCheckError } =
  await supabase
    .from("products")
    .select("id")
    .eq("sku", trimmedSKU)
    .maybeSingle();

if (skuCheckError) {
  alert(
    `Could not verify SKU: ${skuCheckError.message}`
  );
  return;
}

if (existingSKU) {
  alert(
    `SKU "${trimmedSKU}" already exists. Please enter a unique SKU.`
  );
  return;
}

  setLoading(true);

try {
  const uploadedImages: string[] = [];

  // Upload images
  for (let index = 0; index < images.length; index++) {
    const image = images[index];

    console.log("Uploading image:", {
      index,
      name: image.name,
      type: image.type,
      size: image.size,
    });

    try {
      const uploaded = await uploadProductImage({
        file: image,
        category,
        productName: trimmedName,
        color,
        view: imageViews[index] || "front",
        sku: sku.trim(),
      });

      console.log("Image uploaded:", uploaded);

      uploadedImages.push(uploaded.url);
    } catch (uploadError) {
      console.error("IMAGE UPLOAD FAILED:", uploadError);

      throw new Error(
        `Image upload failed: ${
          uploadError instanceof Error
            ? uploadError.message
            : JSON.stringify(uploadError)
        }`
      );
    }
  }

  console.log("All images uploaded:", uploadedImages);

  // Insert product
  try {
    const { error } = await supabase
      .from("products")
      .insert({
        name: trimmedName,
        slug: slugify(trimmedName),
        sku: sku.trim(),

        category,
        subcategory: subcategory || null,

        price: numericPrice,
        stock,

        sizes,

        featured,
        bestseller,
        new_arrival: newArrival,

        badge: badge || null,

        availability,

        description: description.trim(),

        fabric: fabric.trim(),
        embroidery: embroidery.trim(),
        fit: fit.trim(),
        occasion: occasion.trim(),
        care: care.trim(),

        image: uploadedImages[0] ?? null,
        images: uploadedImages,
      });

    if (error) {
      console.error("PRODUCT INSERT FAILED:", error);

      throw new Error(
        `Product save failed: ${error.message} (${error.code ?? "no-code"})`
      );
    }
  } catch (insertError) {
    console.error("PRODUCT INSERT EXCEPTION:", insertError);

    throw insertError;
  }

  console.log("PRODUCT SAVED SUCCESSFULLY");

  onClose();
  window.location.reload();


  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Failed to save product."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8">
        <h2 className="mb-6 text-2xl font-bold">
          Add Product
        </h2>

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
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
      const selectedCategory = e.target.value;

      setCategory(selectedCategory);
      setSubcategory("");
    }}
  >
    <option value="">Select Category</option>

    {categories.map((item) => (
      <option key={item.slug} value={item.name}>
        {item.name}
      </option>
    ))}
  </select>

  <select
    className="mb-4 w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
    value={subcategory}
    onChange={(e) => setSubcategory(e.target.value)}
    disabled={!category}
  >
    <option value="">
      {!category
        ? "Select Category First"
        : subcategories[
              categoryKey as keyof typeof subcategories
          ]?.length
          ? "Select Subcategory"
          : "No Subcategories Available"}
    </option>

    {category &&
      subcategories[
        categoryKey as keyof typeof subcategories
      ]?.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
  </select>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            className="rounded-lg border p-3"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <div className="grid grid-cols-4 gap-3 mb-4">
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

        </div>

<div className="mb-6">
  <label className="mb-2 block font-medium">
    Product Images
  </label>

  <label
    htmlFor="product-images"
    className="group flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-[var(--teal)]/40 bg-[var(--background)] px-6 py-8 text-center transition-all duration-300 hover:border-[var(--teal)] hover:bg-[var(--teal)]/5"
  >
    <div>
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--teal)]/10 text-[var(--teal)] transition group-hover:scale-105">
        ↑
      </div>

      <p className="font-semibold text-[var(--foreground)]">
        Upload Product Images
      </p>

      <p className="mt-1 text-sm text-[var(--muted)]">
        Click to select one or more images
      </p>

      <p className="mt-2 text-xs text-[var(--muted)]">
        JPG, PNG, WEBP
      </p>
    </div>
  </label>

  <input
    id="product-images"
    type="file"
    multiple
    accept="image/*"
    onChange={handleImages}
    className="hidden"
  />

  {images.length > 0 && (
  <div className="mt-4 space-y-3 rounded-xl border p-4">
    <p className="font-semibold">
      Selected Images ({images.length})
    </p>

    {images.map((file, index) => (
      <div
        key={`${file.name}-${index}`}
        className="flex items-center gap-3 rounded-lg bg-[var(--background)] p-3"
      >
        <span className="text-[var(--teal)]">
          ✓
        </span>

        <span className="min-w-0 flex-1 truncate text-sm">
          {file.name}
        </span>

        <select
          value={imageViews[index] || "front"}
          onChange={(e) => {
            const updatedViews = [...imageViews];
            updatedViews[index] = e.target.value;
            setImageViews(updatedViews);
          }}
          className="rounded-lg border p-2 text-sm"
        >
          {IMAGE_VIEW_OPTIONS.map((view) => (
            <option key={view} value={view}>
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </option>
          ))}
        </select>
      </div>
    ))}
  </div>
)}

</div>

        <textarea
          className="mb-4 w-full rounded-lg border p-3"
          rows={5}
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <div className="mb-4 grid grid-cols-2 gap-4">
          <input
            className="rounded-lg border p-3"
            placeholder="Fabric"
            value={fabric}
            onChange={(e) =>
              setFabric(e.target.value)
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Embroidery"
            value={embroidery}
            onChange={(e) =>
              setEmbroidery(e.target.value)
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Fit"
            value={fit}
            onChange={(e) => setFit(e.target.value)}
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Occasion"
            value={occasion}
            onChange={(e) =>
              setOccasion(e.target.value)
            }
          />
        </div>

        <textarea
          className="mb-4 w-full rounded-lg border p-3"
          rows={3}
          placeholder="Care Instructions"
          value={care}
          onChange={(e) => setCare(e.target.value)}
        />

        <select
          className="mb-4 w-full rounded-lg border p-3"
          value={availability}
          onChange={(e) =>
            setAvailability(e.target.value)
          }
        >
          <option>In Stock</option>
          <option>Made to Order</option>
          <option>Sold Out</option>
        </select>

        <select
          className="mb-6 w-full rounded-lg border p-3"
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
        >
          <option value="">No Badge</option>
          <option value="NEW">NEW</option>
          <option value="BESTSELLER">
            BESTSELLER
          </option>
          <option value="LIMITED">
            LIMITED
          </option>
          <option value="SALE">SALE</option>
        </select>

        <div className="mb-6 space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) =>
                setFeatured(e.target.checked)
              }
            />
            Featured Product
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={bestseller}
              onChange={(e) =>
                setBestseller(e.target.checked)
              }
            />
            Bestseller
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={newArrival}
              onChange={(e) =>
                setNewArrival(e.target.checked)
              }
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