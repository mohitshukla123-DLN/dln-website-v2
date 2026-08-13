import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";
import type { Product } from "../../types/product";
import { buildWhatsAppLink } from "../../lib/whatsapp";
import {getWishlist,toggleWishlist,} from "../../lib/wishlist";

interface Props {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onQuickView,
}: Props) {
  const [currentImage, setCurrentImage] = useState(0);

  const [wishlisted, setWishlisted] = useState(false);

  const [whatsappLink, setWhatsappLink] = useState("#");

    useEffect(() => {
      buildWhatsAppLink(
        product.name,
        "",
        product.price,
        product.slug
      ).then(setWhatsappLink);
    }, [product.name, product.price, product.slug]);

  useEffect(() => {
    setWishlisted(getWishlist().includes(product.id));
  }, [product.id]);

  const intervalRef = useRef<number | null>(null);

  const images = Array.from(
      new Set(
        (Array.isArray(product.images)
          ? product.images
          : product.image
          ? [product.image]
          : []
        ).filter(Boolean)
      )
    );

  useEffect(() => {
    setCurrentImage(0);

    if (images.length <= 1) return;

    intervalRef.current = window.setInterval(() => {
      setCurrentImage((index) =>
        index === images.length - 1 ? 0 : index + 1
      );
    }, 3000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [product.id, images.length]);

  function previousImage() {
    setCurrentImage((index) =>
      index === 0 ? images.length - 1 : index - 1
    );
  }

  function nextImage() {
    setCurrentImage((index) =>
      index === images.length - 1 ? 0 : index + 1
    );
  }

  const image = images[currentImage] ?? "";

  return (
    <article className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative overflow-hidden">
        {image ? (
          <div className="aspect-[4/5] overflow-hidden bg-white">
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center bg-white text-sm text-gray-400">
            No image
          </div>
        )}

        {/* Image navigation */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                previousImage();
              }}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-gray-700 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:bg-white"
            >
              ‹
            </button>

            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-gray-700 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:bg-white"
            >
              ›
            </button>
          </>
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
              product.badge === "NEW"
                ? "bg-[var(--teal)] text-white"
                : product.badge === "BESTSELLER"
                ? "bg-[#b08d57] text-white"
                : product.badge === "LIMITED"
                ? "bg-[#7b2d4f] text-white"
                : product.badge === "SALE"
                ? "bg-[#9f3b3b] text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>

      <button
          type="button"
          aria-label={
            wishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            const next = toggleWishlist(product.id);
            setWishlisted(next);

            window.dispatchEvent(new Event("wishlistUpdated"));
          }}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl shadow-md transition hover:scale-105 hover:bg-white"
        >
          <span
            className={wishlisted ? "text-red-600" : "text-gray-500"}
            aria-hidden="true"
          >
            {wishlisted ? "♥" : "♡"}
          </span>
        </button>

      {/* Product information */}
      <div className="bg-white p-5">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--teal)]">
          {product.category}
        </p>

        <h3 className="line-clamp-2 text-lg font-semibold text-black transition-colors group-hover:text-[var(--teal)]">
          {product.name}
        </h3>

        <p className="mt-2 text-xl font-semibold text-black">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

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

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          <Link
            to={`/products/${product.slug}`}
            className="min-w-0 flex-1"
          >
            <Button className="w-full px-4 py-3 text-sm">
              View Details
            </Button>
          </Link>

          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1"
          >
            <Button className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[var(--teal)]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2a10 10 0 0 0-8.66 15l-1.05 3.82 3.91-1.03A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.08-1.12l-.29-.17-2.32.61.62-2.26-.18-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.07 3.59.57.25 1.01.4 1.35.51.57.18 1.09.16 1.5.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                </svg>
              </span>
              <span>WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>
    </article>
  );
}