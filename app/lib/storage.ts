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

  let fileName = `${baseFileName}.${extension}`;
  let filePath = `products/${fileName}`;

  const { data: existing } = await supabase.storage
    .from("products")
    .list("products", {
      search: fileName,
      limit: 1,
    });

  if (existing && existing.length > 0) {
    const uniqueSuffix = crypto.randomUUID().split("-")[0];

    fileName =
      `${baseFileName}-${uniqueSuffix}.${extension}`;

    filePath = `products/${fileName}`;
  }

  const { error } = await supabase.storage
  .from("products")
  .upload(filePath, file, {
    upsert: true,
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