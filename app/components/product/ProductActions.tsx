import { useEffect, useState } from "react";

import Button from "../ui/Button";
import { buildWhatsAppLink } from "../../lib/whatsapp";
import {
  getWishlist,
  toggleWishlist,
} from "../../lib/wishlist";

interface Props {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
  };
  selectedSize: string;
  onShare: () => void;
}

export default function ProductActions({
  product,
  selectedSize,
  onShare,
}: Props) {
  const [wishlisted, setWishlisted] = useState(
    getWishlist().includes(product.id)
  );
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    const handleWishlistUpdated = () => {
      setWishlisted(
        getWishlist().includes(product.id)
      );
    };

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdated
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdated
      );
    };
  }, [product.id]);

  function requireSize() {
    setSizeError(true);

    setTimeout(() => {
      setSizeError(false);
    }, 2500);
  }

  function handleWishlist() {
    const next = toggleWishlist(product.id);

    setWishlisted(next);

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  }

  const whatsappLink = selectedSize
    ? buildWhatsAppLink(
        product.name,
        selectedSize,
        product.price,
        product.slug
      )
    : "#";

  return (
    <div className="mt-8 sm:mt-10">
      {sizeError && (
        <p className="mb-3 text-sm font-medium text-red-600">
          Please select a size
        </p>
      )}

      <div className="grid w-full grid-cols-3 gap-2 sm:gap-3">
        {/* WhatsApp Enquiry */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
            if (!selectedSize) {
              event.preventDefault();
              requireSize();
            }
          }}
          className="block min-w-0 w-full"
        >
          <Button className="h-11 w-full min-w-0 gap-1.5 px-1.5 text-[11px] font-normal leading-none sm:px-3 sm:text-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[var(--burgundy)]">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a10 10 0 0 0-8.66 15l-1.05 3.82 3.91-1.03A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.08-1.12l-.29-.17-2.32.61.62-2.26-.18-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.07 3.59.57.25 1.09.16 1.5.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
              </svg>
            </span>

            <span className="whitespace-nowrap font-normal text-[11px] sm:text-sm">
              Enquiry
            </span>
          </Button>
        </a>

        {/* Wishlist */}
        <Button
          className="h-11 w-full min-w-0 px-1.5 text-[11px] font-normal leading-none sm:px-3 sm:text-sm"
          onClick={handleWishlist}
        >
          <span className="whitespace-nowrap font-normal text-[11px] sm:text-sm">
            {wishlisted
              ? "Remove Wishlist"
              : "Add Wishlist"}
          </span>
        </Button>

        {/* Share */}
        <Button
          type="button"
          className="h-11 w-full min-w-0 gap-1.5 px-1.5 text-[11px] font-normal leading-none sm:px-3 sm:text-sm"
          onClick={onShare}
        >
          <span className="inline-flex shrink-0">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="2.5" />
              <circle cx="6" cy="12" r="2.5" />
              <circle cx="18" cy="19" r="2.5" />
              <path d="m8.2 10.8 7.6-4.6" />
              <path d="m8.2 13.2 7.6 4.6" />
            </svg>
          </span>

          <span className="whitespace-nowrap font-normal text-[11px] sm:text-sm">
            Share
          </span>
        </Button>
      </div>
    </div>
  );
}