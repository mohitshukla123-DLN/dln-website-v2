import {
  ChangeEvent,
  DragEvent,
  useState,
} from "react";
import { supabase } from "../../lib/supabase";
import { uploadProductImage } from "../../lib/storage";
import ProductImageCropper from "./ProductImageCropper";
import { categories } from "../../data/categories";
import { subcategories } from "../../data/subcategories";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface ProductImage {
  id: string;
  file: File;
  preview: string;
  view: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_PRODUCT_IMAGES = 8;

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

  const [images, setImages] = useState<ProductImage[]>([]);

  const [cropFile, setCropFile] =
    useState<File | null>(null);

  const [dragIndex, setDragIndex] =
    useState<number | null>(null);

  if (!open) return null;

  const categoryKey = category
    .toLowerCase()
    .replace(/\s+/g, "-");

  function createImageItem(file: File): ProductImage {
    return {
      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,
      file,
      preview: URL.createObjectURL(file),
      view: images.length === 0 ? "front" : "back",
    };
  }

  function validateFile(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert(
        `${file.name} is not supported. Use JPG, PNG, or WEBP.`
      );
      return false;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert(
        `${file.name} is too large. Maximum size is 10 MB.`
      );
      return false;
    }

    return true;
  }

  function addFiles(files: File[]) {
    const validFiles = files.filter(validateFile);

    if (
      images.length + validFiles.length >
      MAX_PRODUCT_IMAGES
    ) {
      alert(
        `You can have a maximum of ${MAX_PRODUCT_IMAGES} product images.`
      );
      return;
    }

    if (validFiles.length === 0) return;

    setCropFile(validFiles[0]);

    const remaining = validFiles.slice(1);

    if (remaining.length > 0) {
      const newItems = remaining.map((file) => ({
        id:
          `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
        view: "back",
      }));

      setImages((current) => [
        ...current,
        ...newItems,
      ]);
    }
  }

  function handleImages(
    e: ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    addFiles(Array.from(e.target.files));

    e.target.value = "";
  }

  function handleDrop(
    e: DragEvent<HTMLDivElement>
  ) {
    e.preventDefault();

    const files = Array.from(
      e.dataTransfer.files
    );

    addFiles(files);
  }

  function handleCropDone(file: File) {
    const item: ProductImage = {
      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,
      file,
      preview: URL.createObjectURL(file),
      view: images.length === 0 ? "front" : "back",
    };

    setImages((current) => [
      ...current,
      item,
    ]);

    setCropFile(null);
  }

  function removeImage(index: number) {
    setImages((current) => {
      const image = current[index];

      if (image) {
        URL.revokeObjectURL(image.preview);
      }

      return current.filter(
        (_, i) => i !== index
      );
    });
  }

  function setPrimaryImage(index: number) {
    if (index === 0) return;

    setImages((current) => {
      const updated = [...current];

      const [primary] =
        updated.splice(index, 1);

      return [primary, ...updated];
    });
  }

  function reorderImages(
    fromIndex: number,
    toIndex: number
  ) {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0
    ) {
      return;
    }

    setImages((current) => {
      const updated = [...current];

      const [moved] =
        updated.splice(fromIndex, 1);

      updated.splice(toIndex, 0, moved);

      return updated;
    });
  }

  async function saveProduct() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Not logged in");
      return;
    }

    const trimmedName = name.trim();
    const trimmedColor = color.trim();
    const trimmedSKU =
      sku.trim().toUpperCase();
    const trimmedDescription =
      description.trim();

    const numericPrice = Number(price);

    if (!trimmedName) {
      alert("Product name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      alert(
        "Product name must be at least 2 characters."
      );
      return;
    }

    if (trimmedName.length > 120) {
      alert(
        "Product name must be 120 characters or less."
      );
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!trimmedColor) {
      alert("Please enter the product color.");
      return;
    }

    if (!trimmedSKU) {
      alert("Please enter the product SKU.");
      return;
    }

    if (
      trimmedSKU.length < 2 ||
      trimmedSKU.length > 40
    ) {
      alert(
        "SKU must be between 2 and 40 characters."
      );
      return;
    }

    if (!/^[A-Z0-9-]+$/.test(trimmedSKU)) {
      alert(
        "SKU may contain only letters, numbers, and hyphens."
      );
      return;
    }

    if (
      subcategories[
        categoryKey as keyof typeof subcategories
      ]?.length > 0 &&
      !subcategory
    ) {
      alert("Please select a subcategory.");
      return;
    }

    if (
      !price ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      alert(
        "Please enter a valid price greater than 0."
      );
      return;
    }

    if (images.length === 0) {
      alert(
        "Please upload at least one product image."
      );
      return;
    }

    if (!trimmedDescription) {
      alert("Product description is required.");
      return;
    }

    if (trimmedDescription.length < 10) {
      alert(
        "Product description must be at least 10 characters."
      );
      return;
    }

    const stock = Object.values(sizes).reduce(
      (total, value) =>
        total + Number(value || 0),
      0
    );

    if (stock <= 0) {
      alert(
        "Please enter stock quantity for at least one size."
      );
      return;
    }

    const {
      data: existingSKU,
      error: skuCheckError,
    } = await supabase
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
        `SKU "${trimmedSKU}" already exists.`
      );
      return;
    }

    setLoading(true);

    try {
      const uploadedImages: string[] = [];

      for (
        let index = 0;
        index < images.length;
        index++
      ) {
        const item = images[index];

        const uploaded =
          await uploadProductImage({
            file: item.file,
            category,
            productName: trimmedName,
            color: trimmedColor,
            view: item.view,
            sku: trimmedSKU,
          });

        uploadedImages.push(
          uploaded.url
        );
      }

      const { error } = await supabase
        .from("products")
        .insert({
          name: trimmedName,
          slug: slugify(trimmedName),
          sku: trimmedSKU,

          category,
          subcategory:
            subcategory || null,

          color: trimmedColor,

          price: numericPrice,
          stock,

          sizes,

          featured,
          bestseller,
          new_arrival: newArrival,

          badge: badge || null,

          availability,

          description:
            trimmedDescription,

          fabric: fabric.trim(),
          embroidery:
            embroidery.trim(),
          fit: fit.trim(),
          occasion:
            occasion.trim(),
          care: care.trim(),

          image:
            uploadedImages[0] ?? null,

          images: uploadedImages,
        });

      if (error) {
        throw new Error(
          `Product save failed: ${error.message}`
        );
      }

      images.forEach((image) => {
        URL.revokeObjectURL(
          image.preview
        );
      });

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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8">
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
            placeholder="SKU"
            value={sku}
            onChange={(e) =>
              setSku(e.target.value)
            }
          />

          <input
            className="mb-4 w-full rounded-lg border p-3"
            placeholder="Color"
            value={color}
            onChange={(e) =>
              setColor(e.target.value)
            }
          />

          <select
            className="mb-4 w-full rounded-lg border p-3"
            value={category}
            onChange={(e) => {
              setCategory(
                e.target.value
              );
              setSubcategory("");
            }}
          >
            <option value="">
              Select Category
            </option>

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
            className="mb-4 w-full rounded-lg border p-3 disabled:bg-gray-100"
            value={subcategory}
            onChange={(e) =>
              setSubcategory(
                e.target.value
              )
            }
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
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
          </select>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <input
              className="rounded-lg border p-3"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
            />

            <div className="grid grid-cols-4 gap-3">
              {Object.entries(sizes).map(
                ([size, qty]) => (
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
                          [size]:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-lg border p-2"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-medium">
              Product Images
            </label>

            <div
              onDragOver={(e) =>
                e.preventDefault()
              }
              onDrop={handleDrop}
              className="rounded-xl border-2 border-dashed border-[var(--burgundy)]/40 bg-[var(--background)] p-8 text-center transition hover:border-[var(--burgundy)]"
            >
              <label
                htmlFor="product-images"
                className="cursor-pointer"
              >
                <div className="mb-2 text-4xl text-[var(--burgundy)]">
                  ↑
                </div>

                <div className="font-semibold">
                  Drag & drop images here
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  or click to select multiple images
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  JPG, PNG, WEBP • Max 8 images •
                  10 MB each
                </div>
              </label>

              <input
                id="product-images"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImages}
                className="hidden"
              />
            </div>

            {images.length > 0 && (
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">
                    Selected Images ({images.length}/{MAX_PRODUCT_IMAGES})
                  </h3>

                  <p className="text-xs text-[var(--muted)]">
                    First image = Primary
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={() => setDragIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIndex !== null) {
                          reorderImages(dragIndex, index);
                          setDragIndex(null);
                        }
                      }}
                      className="overflow-hidden rounded-xl border bg-white shadow-sm"
                    >
                      <div className="relative aspect-square bg-gray-100">
                        <img
                          src={image.preview}
                          alt={`Product image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
                          {index === 0 ? "Primary" : `Image ${index + 1}`}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white shadow"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          ×
                        </button>
                      </div>

                      <div className="p-3">
                        <p className="mb-2 truncate text-xs text-gray-500">
                          {image.file.name}
                        </p>

                        <select
                          value={image.view}
                          onChange={(e) => {
                            const updated = [...images];
                            updated[index] = {
                              ...updated[index],
                              view: e.target.value,
                            };
                            setImages(updated);
                          }}
                          className="w-full rounded-lg border p-2 text-sm"
                        >
                          {IMAGE_VIEW_OPTIONS.map((view) => (
                            <option key={view} value={view}>
                              {view.charAt(0).toUpperCase() + view.slice(1)}
                            </option>
                          ))}
                        </select>

                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className="mt-2 w-full rounded-lg border px-3 py-2 text-xs font-medium"
                          >
                            Set as Primary
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-xs text-[var(--muted)]">
                  Drag images to reorder them. The first image will be the
                  primary product image.
                </p>
              </div>
            )}
          </div>

          <textarea
            className="mb-4 w-full rounded-lg border p-3"
            rows={5}
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
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
                setEmbroidery(
                  e.target.value
                )
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="Fit"
              value={fit}
              onChange={(e) =>
                setFit(e.target.value)
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="Occasion"
              value={occasion}
              onChange={(e) =>
                setOccasion(
                  e.target.value
                )
              }
            />
          </div>

          <textarea
            className="mb-4 w-full rounded-lg border p-3"
            rows={3}
            placeholder="Care Instructions"
            value={care}
            onChange={(e) =>
              setCare(e.target.value)
            }
          />

          <select
            className="mb-4 w-full rounded-lg border p-3"
            value={availability}
            onChange={(e) =>
              setAvailability(
                e.target.value
              )
            }
          >
            <option>In Stock</option>
            <option>Made to Order</option>
            <option>Sold Out</option>
          </select>

          <select
            className="mb-6 w-full rounded-lg border p-3"
            value={badge}
            onChange={(e) =>
              setBadge(e.target.value)
            }
          >
            <option value="">
              No Badge
            </option>
            <option value="NEW">
              NEW
            </option>
            <option value="BESTSELLER">
              BESTSELLER
            </option>
            <option value="LIMITED">
              LIMITED
            </option>
            <option value="SALE">
              SALE
            </option>
          </select>

          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) =>
                  setFeatured(
                    e.target.checked
                  )
                }
              />
              Featured Product
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={bestseller}
                onChange={(e) =>
                  setBestseller(
                    e.target.checked
                  )
                }
              />
              Bestseller
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) =>
                  setNewArrival(
                    e.target.checked
                  )
                }
              />
              New Arrival
            </label>
          </div>

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
              onClick={saveProduct}
              disabled={
                loading ||
                images.length === 0
              }
              className="rounded-lg bg-black px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Uploading & Saving..."
                : "Save Product"}
            </button>
          </div>
        </div>
      </div>

      {cropFile && (
        <ProductImageCropper
          file={cropFile}
          onDone={handleCropDone}
          onCancel={() =>
            setCropFile(null)
          }
        />
      )}
    </>
  );
}
