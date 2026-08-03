import Button from "../ui/Button";
import { buildWhatsAppLink } from "../../lib/whatsapp";

interface Props {
  product: {
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
  return (
    <div className="mt-10">
      <a
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
            alert("Please select a size.");
          }
        }}
      >
        <Button className="flex items-center justify-center gap-3">
          WhatsApp Enquiry
        </Button>
      </a>
    </div>
  );
}