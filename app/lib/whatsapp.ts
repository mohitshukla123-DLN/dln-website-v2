const WHATSAPP_NUMBER = "917570828473";
const WEBSITE = "https://dresslikenawaabs.pages.dev";

export function buildWhatsAppLink(
  productName: string,
  size: string,
  price: number,
  slug: string
) {
  const message = `Hello Dress Like Nawaabs,

I'm interested in the following outfit.

Product:
${productName}

Size:
${size || "Not selected"}

Price:
₹${price.toLocaleString("en-IN")}

Product Link:
${WEBSITE}/products/${slug}

Please share availability and further details.

Thank you.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}