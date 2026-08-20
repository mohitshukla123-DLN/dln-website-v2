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
  const baseFileName =
    `${slugify(category)}-` +
    `${slugify(productName)}-` +
    `${slugify(color)}-` +
    `${slugify(view)}-` +
    `${slugify(sku)}`;

  const uniqueSuffix =
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const fileName = `${baseFileName}-${uniqueSuffix}.webp`;

  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filePath, file, {
      upsert: false,
      contentType: "image/webp",
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(
      `Image upload failed for "${file.name}". ${error.message}`
    );
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: data.publicUrl,
  };
}

export async function deleteProductImage(url: string) {
  const marker = "/storage/v1/object/public/products/";

  const index = url.indexOf(marker);

  if (index === -1) {
    return;
  }

  const path = decodeURIComponent(
    url.substring(index + marker.length)
  );

  const { error } = await supabase.storage
    .from("products")
    .remove([path]);

  if (error) {
    console.error("Storage image deletion failed:", error);
  }
}
