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

  const whatsappLink = selectedSize
  ? buildWhatsAppLink(
      product.name,
      selectedSize,
      product.price,
      product.slug
    )
  : "#";

  return (
    <div className="mt-10 flex flex-row gap-3">
      <a
        className="min-w-0 flex-1"
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!selectedSize) {
            e.preventDefault();
            requireSize();
          }
        }}
      >
        <Button className="w-full whitespace-nowrap px-3 text-sm">
          WhatsApp Enquiry
        </Button>
      </a>

      <Button
        className="min-w-0 flex-1 whitespace-nowrap px-3 text-sm"
        onClick={handleWishlist}
      >
        {wishlisted
          ? "Remove from Wishlist"
          : "Add to Wishlist"}
      </Button>
    </div>
  );
}