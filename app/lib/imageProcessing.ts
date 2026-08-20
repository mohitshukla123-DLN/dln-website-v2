import imageCompression from "browser-image-compression";

export async function processProductImage(
  file: File,
  cropAreaPixels: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
): Promise<File> {
  const image = await createImageBitmap(file);

  const canvas = document.createElement("canvas");

  canvas.width = cropAreaPixels.width;
  canvas.height = cropAreaPixels.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create image canvas.");
  }

  ctx.drawImage(
    image,
    cropAreaPixels.x,
    cropAreaPixels.y,
    cropAreaPixels.width,
    cropAreaPixels.height,
    0,
    0,
    cropAreaPixels.width,
    cropAreaPixels.height
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.88)
  );

  if (!blob) {
    throw new Error("Could not convert image to WebP.");
  }

  const webpFile = new File(
    [blob],
    `${file.name.replace(/\.[^/.]+$/, "")}.webp`,
    {
      type: "image/webp",
    }
  );

  return imageCompression(webpFile, {
    maxSizeMB: 2,
    maxWidthOrHeight: 2400,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.88,
  });
}
