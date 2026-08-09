import { supabase } from "./supabase";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface UploadProductImageOptions {
  file: File;
  category: string;
  productName: string;
  color: string;
  view: string;
  sku: string;
}

export async function uploadProductImage({
  file,
  category,
  productName,
  color,
  view,
  sku,
}: UploadProductImageOptions) {
  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const baseFileName =
    `${slugify(category)}-` +
    `${slugify(productName)}-` +
    `${slugify(color)}-` +
    `${slugify(view)}-` +
    `${slugify(sku)}`;

  const uniqueSuffix = crypto.randomUUID()
    .split("-")[0];

  const fileName =
    `${baseFileName}-${uniqueSuffix}.${extension}`;

  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: data.publicUrl,
  };
}