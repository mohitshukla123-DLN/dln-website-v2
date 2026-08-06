import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import Button from "../ui/Button";

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductQuickView({
  product,
  open,
  onClose,
}: Props) {
  if (!open || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-3xl font-light"
        >
          ×
        </button>

        <div className="grid gap-10 p-8 md:grid-cols-2">

          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-2xl object-cover"
          />

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-[var(--teal)]">
              {product.category}
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {product.name}
            </h2>

            <p className="mt-4 text-3xl font-bold text-[var(--teal)]">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p className="mt-4 text-yellow-500">
              ★★★★★ {product.rating} ({product.reviews})
            </p>

            <p className="mt-8 leading-8 text-[var(--muted)]">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {Object.keys(product.sizes ?? {}).map((size) => (
                <span
                  key={size}
                  className="rounded-xl border px-4 py-2"
                >
                  {size}
                </span>
              ))}
            </div>

            <div className="mt-10 flex gap-4">

              <Link
                to={`/products/${product.slug}`}
                onClick={onClose}
                className="flex-1"
              >
                <Button className="w-full">
                  View Details
                </Button>
              </Link>

              <a
                href={`https://wa.me/?text=I'm interested in ${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full">
                  WhatsApp
                </Button>
              </a>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}