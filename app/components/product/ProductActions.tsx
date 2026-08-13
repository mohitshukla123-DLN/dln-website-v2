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
}

export default function ProductActions({
  product,
  selectedSize,
}: Props) {
  const [wishlisted, setWishlisted] = useState(
    getWishlist().includes(product.id)
  );

  const [whatsappLink, setWhatsappLink] = useState("#");

  useEffect(() => {
    if (!selectedSize) {
      setWhatsappLink("#");
      return;
    }

    let cancelled = false;

    async function loadWhatsAppLink() {
      try {
        const link = await buildWhatsAppLink(
          product.name,
          selectedSize,
          product.price,
          product.slug
        );

        if (!cancelled) {
          setWhatsappLink(link);
        }
      } catch {
        if (!cancelled) {
          setWhatsappLink("#");
        }
      }
    }

    loadWhatsAppLink();

    return () => {
      cancelled = true;
    };
  }, [
    product.name,
    product.slug,
    product.price,
    selectedSize,
  ]);

  function requireSize() {
    alert("Please select a size.");
  }

  function handleWishlist() {
    const next = toggleWishlist(product.id);

    setWishlisted(next);

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  }

  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
      <a
        className="flex-1"
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!selectedSize || whatsappLink === "#") {
            e.preventDefault();
            requireSize();
          }
        }}
      >
        <Button className="w-full">
          WhatsApp Enquiry
        </Button>
      </a>

      <Button
        className="flex-1"
        onClick={handleWishlist}
      >
        {wishlisted
          ? "Remove from Wishlist"
          : "Add to Wishlist"}
      </Button>
    </div>
  );
}