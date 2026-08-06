import { ChangeEvent, useState } from "react";
import { supabase } from "../../lib/supabase";
import { uploadProductImage } from "../../lib/storage";

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

  const [availability, setAvailability] =
    useState("In Stock");

  const [badge, setBadge] = useState("");

  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);

  const [images, setImages] = useState<File[]>([]);

  function handleImages(
    e: ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    setImages(Array.from(e.target.files));
  }

  if (!open) return null;

  async function saveProduct() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    alert("Not logged in");
    return;
  }

  setLoading(true);

  const uploadedImages: string[] = [];

  for (const image of images) {
    const uploaded = await uploadProductImage(image);
    uploadedImages.push(uploaded.url);
  }

  const { error } = await supabase
    .from("products")
    .insert({
      name,
      slug: slugify(name),
      sku: generateSKU(),

      category,
      subcategory: null,

      price: Number(price),
      stock: Number(stock),

      featured: false,
      bestseller: false,
      new_arrival: false,

      badge: null,

      availability: "In Stock",

      description: null,

      fabric: null,
      embroidery: null,
      fit: null,
      occasion: null,
      care: null,

      sizes: [],

      image: uploadedImages[0] ?? null,
      images: uploadedImages,
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

        <select
          className="mb-4 w-full rounded-lg border p-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
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
          placeholder="Sub Category"
          value={subcategory}
          onChange={(e) =>
            setSubcategory(e.target.value)
          }
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            className="rounded-lg border p-3"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <textarea
          className="mb-4 w-full rounded-lg border p-3"
          rows={4}
          placeholder="Description"
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Fabric"
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Embroidery"
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Fit"
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="Occasion"
        />

        <textarea
          className="mb-4 w-full rounded-lg border p-3"
          rows={2}
          placeholder="Care Instructions"
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