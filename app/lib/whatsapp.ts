import { supabase } from "./supabase";

export async function buildWhatsAppLink(
  productName: string,
  size: string,
  price: number,
  slug: string
) {
  const website = "https://dresslikenawaabs.pages.dev";

  const { data } = await supabase
    .from("site_settings")
    .select("site_name,whatsapp")
    .limit(1)
    .single();

  const siteName = data?.site_name || "Dress Like Nawaabs";
  const whatsapp = data?.whatsapp?.replace(/\D/g, "");

  if (!whatsapp) {
    throw new Error("WhatsApp number is not configured.");
  }

  const message = `Hello ${siteName},

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

  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}