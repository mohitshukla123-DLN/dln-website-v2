import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";

import type { Product } from "../../types/product";

import {
  isWishlisted,
  toggleWishlist,
} from "../../lib/wishlist";

interface Props {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onQuickView,
}: Props) {
  const [wishlisted, setWishlisted] = useState(
    isWishlisted(product.id)
  );

  const [currentImage, setCurrentImage] =
  useState(0);

  const intervalRef = useRef<number | null>(null);

  function handleWishlist() {
  toggleWishlist(product.id);

  window.dispatchEvent(new Event("wishlistUpdated"));

  setWishlisted(
    isWishlisted(product.id)
  );
}

useEffect(() => {
  setCurrentImage(0);

  if (product.images.length <= 1) return;

    intervalRef.current = window.setInterval(() => {
      setCurrentImage((index) =>
        index === product.images.length - 1
          ? 0
          : index + 1
      );
    }, 3000);

    return () => {
      if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
    };
  }, [product.id, product.images.length]);

  function previousImage() {
  setCurrentImage((index) =>
    index === 0
      ? product.images.length - 1
      : index - 1
  );
}

  function nextImage() {
    setCurrentImage((index) =>
      index === product.images.length - 1
        ? 0
        : index + 1
    );
  }

  const badgeColors: Record<
    NonNullable<Product["badge"]>,
    string
  > = {
    NEW: "bg-green-600",
    BESTSELLER: "bg-orange-500",
    LIMITED: "bg-red-600",
    SALE: "bg-purple-600",
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

      <div className="relative overflow-hidden">

        <img
          src={product.images[currentImage]}
          alt={product.name}
          className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {product.badge && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white shadow ${badgeColors[product.badge]}`}
          >
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label="Wishlist"
          onClick={handleWishlist}
          className="absolute right-4 top-4 rounded-full bg-white/95 p-2 shadow-md transition hover:scale-110"
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>

        {product.images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              previousImage();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow transition-all duration-300 group-hover:opacity-100 hover:bg-white"
          >
            ‹
          </button>
        )}

        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute bottom-4 right-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 hover:bg-[var(--teal)] hover:text-white"
          >
            👁 Quick View
          </button>
        )}

        {product.images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow transition-all duration-300 group-hover:opacity-100 hover:bg-white"
          >
            ›
          </button>
        )}

        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-800 shadow">
          {product.category}
        </div>

      </div>

      <div className="p-7">

        <h3 className="line-clamp-2 text-xl font-semibold transition-colors group-hover:text-[var(--teal)]">
          {product.name}
        </h3>

        <p className="mt-3 text-3xl font-bold text-[var(--teal)]">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

          {product.availability && (
            <p
              className={`mt-2 text-sm font-semibold ${
                product.availability === "In Stock"
                  ? "text-green-600"
                  : product.availability === "Made to Order"
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            >
              {product.availability}
            </p>
          )}

        {product.stock === 0 && (
          <p className="mt-2 text-sm font-semibold text-red-600">
            Sold Out
          </p>
        )}

        {product.stock !== undefined &&
          product.stock > 0 &&
          product.stock <= 2 && (
            <p className="mt-2 text-sm font-semibold text-orange-600">
              Only {product.stock} left
            </p>
        )}

        <Link
          to={`/products/${product.slug}`}
          className="block"
        >
          <Button className="mt-7 w-full">
            View Details
          </Button>
        </Link>

      </div>

    </article>
  );
}