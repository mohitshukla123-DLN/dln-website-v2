import { supabase } from "./supabase";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function uploadProductImage(
  file: File,
  productName?: string
) {
  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const baseName = productName
    ? slugify(productName)
    : "product-image";

  const randomSuffix = crypto.randomUUID().split("-")[0];

  const fileName = `${baseName}-${randomSuffix}.${extension}`;

  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: data.publicUrl,
  };
}