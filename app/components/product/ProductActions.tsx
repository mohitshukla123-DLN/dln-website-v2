import Button from "../ui/Button";
import { buildWhatsAppLink } from "../../lib/whatsapp";

interface Props {
  product: {
    name: string;
    slug: string;
    price: number;
  };
  selectedSize: string;
  onEnquiry?: () => void;
}

export default function ProductActions({
  product,
  selectedSize,
  onEnquiry,
}: Props) {
  function requireSize() {
    alert("Please select a size.");
  }

  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
      <a
        className="flex-1"
        href={
          selectedSize
            ? buildWhatsAppLink(
                product.name,
                selectedSize,
                product.price,
                product.slug
              )
            : "#"
        }
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!selectedSize) {
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
        onClick={() => {
          if (!selectedSize) {
            requireSize();
            return;
          }

          onEnquiry?.();
        }}
      >
        Email Enquiry
      </Button>
    </div>
  );
}