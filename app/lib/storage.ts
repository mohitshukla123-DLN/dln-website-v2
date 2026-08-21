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

  const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
        ? "webp"
        : "jpg";

    const fileName =
      `${baseFileName}-${uniqueSuffix}.${extension}`;

    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
        cacheControl: "31536000",
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

interface UploadProductVideoOptions {
  file: File;
  category: string;
  productName: string;
  sku: string;
}

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export async function uploadProductVideo({
  file,
  category,
  productName,
  sku,
}: UploadProductVideoOptions) {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    throw new Error(
      `"${file.name}" is not supported. Use MP4, WebM or MOV.`
    );
  }

  if (file.size > MAX_VIDEO_SIZE) {
    throw new Error(
      `"${file.name}" is too large. Maximum video size is 100MB.`
    );
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "mp4";

  const baseName =
    `${slugify(category)}-${slugify(productName)}-${slugify(sku)}`;

  const fileName =
    `${baseName}-video-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${extension}`;

  const filePath = `products/videos/${fileName}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type,
      cacheControl: "31536000",
    });

  if (error) {
    throw new Error(
      `Video upload failed for "${file.name}". ${error.message}`
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

export async function deleteProductVideo(url: string) {
  const marker = "/storage/v1/object/public/products/";

  const index = url.indexOf(marker);

  if (index === -1) return;

  const path = decodeURIComponent(
    url.substring(index + marker.length)
  );

  const { error } = await supabase.storage
    .from("products")
    .remove([path]);

  if (error) {
    console.error(
      "Storage video deletion failed:",
      error
    );
  }
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
