export function buildWhatsAppLink(
  productName: string,
  size: string,
  price: number,
  slug: string
) {
  const website = "https://dresslikenawaabs.pages.dev";

  const message = `Hello Dress Like Nawaabs,

I'm interested in the following outfit.

Product:
${productName}

Size:
${size || "Not selected"}

Price:
₹${price.toLocaleString("en-IN")}

Product Link:
${website}/products/${slug}

Please share availability and further details.

Thank you.`;

  return `https://wa.me/917570828473?text=${encodeURIComponent(
    message
  )}`;
}