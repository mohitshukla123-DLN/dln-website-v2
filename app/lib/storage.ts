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

async function optimizeVideo(file: File): Promise<File> {
  // Don't re-encode if the browser cannot use MediaRecorder.
  if (!("MediaRecorder" in window)) {
    return file;
  }

  // Already reasonably small — keep original.
  if (file.size <= 15 * 1024 * 1024) {
    return file;
  }

  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "metadata";

  const objectUrl = URL.createObjectURL(file);

  try {
    video.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () =>
        reject(new Error("Could not read video."));
    });

    const stream =
      (video as HTMLVideoElement & {
        captureStream?: () => MediaStream;
      }).captureStream?.();

    if (!stream) {
      return file;
    }

    const mimeTypes = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];

    const mimeType = mimeTypes.find((type) =>
      MediaRecorder.isTypeSupported(type)
    );

    if (!mimeType) {
      return file;
    }

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 2_500_000,
    });

    const chunks: Blob[] = [];

    const optimized = new Promise<Blob>(
      (resolve, reject) => {
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onerror = () => {
          reject(
            new Error("Video optimization failed.")
          );
        };

        recorder.onstop = () => {
          resolve(
            new Blob(chunks, {
              type: mimeType,
            })
          );
        };
      }
    );

    video.currentTime = 0;

    await video.play();

    recorder.start();

    await new Promise<void>((resolve) => {
      video.onended = () => resolve();
    });

    recorder.stop();

    const blob = await optimized;

    // Only use optimized version if it is actually smaller.
    if (blob.size >= file.size) {
      return file;
    }

    return new File(
      [blob],
      `${file.name.replace(/\.[^/.]+$/, "")}.webm`,
      {
        type: "video/webm",
        lastModified: Date.now(),
      }
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

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

  const optimizedFile = await optimizeVideo(file);

  const baseName =
    `${slugify(category)}-${slugify(productName)}-${slugify(sku)}`;

  const fileName =
    `${baseName}-video-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.webm`;

  const filePath =
    `products/videos/${fileName}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filePath, optimizedFile, {
      upsert: false,
      contentType: optimizedFile.type,
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
