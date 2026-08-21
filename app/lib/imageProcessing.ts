import imageCompression from "browser-image-compression";

const OUTPUT_WIDTH = 2400;
const OUTPUT_HEIGHT = 3000;

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

  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create image canvas.");
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);

  // Use the selected crop area, but fit the complete selected image
  // inside the 4:5 output instead of stretching or cutting it.
  const sourceWidth = cropAreaPixels.width;
  const sourceHeight = cropAreaPixels.height;

  const scale = Math.min(
    OUTPUT_WIDTH / sourceWidth,
    OUTPUT_HEIGHT / sourceHeight
  );

  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;

  const offsetX = (OUTPUT_WIDTH - drawWidth) / 2;
  const offsetY = (OUTPUT_HEIGHT - drawHeight) / 2;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    cropAreaPixels.x,
    cropAreaPixels.y,
    sourceWidth,
    sourceHeight,
    offsetX,
    offsetY,
    drawWidth,
    drawHeight
  );

  image.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.92)
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
    maxSizeMB: 2.5,
    maxWidthOrHeight: 2400,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.92,
  });
}