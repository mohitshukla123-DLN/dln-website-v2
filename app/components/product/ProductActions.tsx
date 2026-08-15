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
        <Button className="flex w-full items-center justify-center gap-1.5 px-2 text-xs sm:px-3 sm:text-sm">
          <span className="sm:hidden flex items-center justify-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0 sm:h-4 sm:w-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg><span>Enquiry</span></span>
          <span className="hidden sm:inline">WhatsApp Enquiry</span>
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