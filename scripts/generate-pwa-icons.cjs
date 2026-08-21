const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const source = path.resolve(
  "app/assets/logos/logo-home-400.webp"
);

const outputDir = path.resolve("public");

async function removeBackground() {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;

  /*
   * The original logo is kept completely intact.
   *
   * We only remove background pixels connected to
   * the outside edges of the image.
   *
   * This avoids cropping the circular logo.
   */

  const visited = new Uint8Array(
    width * height
  );

  const queue = [];

  function index(x, y) {
    return y * width + x;
  }

  function addPixel(x, y) {
    if (
      x < 0 ||
      y < 0 ||
      x >= width ||
      y >= height
    ) {
      return;
    }

    const idx = index(x, y);

    if (visited[idx]) {
      return;
    }

    visited[idx] = 1;
    queue.push([x, y]);
  }

  /*
   * Start flood fill from every edge pixel.
   */
  for (let x = 0; x < width; x++) {
    addPixel(x, 0);
    addPixel(x, height - 1);
  }

  for (let y = 0; y < height; y++) {
    addPixel(0, y);
    addPixel(width - 1, y);
  }

  /*
   * Determine whether a pixel is part of the
   * dark background.
   *
   * The tolerance allows for WebP compression
   * and subtle background variations.
   */
  function isBackgroundPixel(x, y) {
    const i = index(x, y) * 4;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const brightness =
      (r + g + b) / 3;

    /*
     * Dark neutral pixels = background.
     *
     * We deliberately avoid removing coloured
     * pixels belonging to the actual logo.
     */
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const saturation =
      max - min;

    return (
      brightness < 100 &&
      saturation < 45
    );
  }

  /*
   * Flood-fill only background-connected pixels.
   */
  let position = 0;

  while (position < queue.length) {
    const [x, y] = queue[position++];

    if (!isBackgroundPixel(x, y)) {
      continue;
    }

    const i = index(x, y) * 4;

    /*
     * Make background transparent.
     */
    data[i + 3] = 0;

    addPixel(x + 1, y);
    addPixel(x - 1, y);
    addPixel(x, y + 1);
    addPixel(x, y - 1);
  }

  return sharp(data, {
    raw: {
      width,
      height,
      channels: 4,
    },
  });
}

async function generateIcon(
  logo,
  filename,
  size,
  paddingPercent
) {
  const padding =
    Math.round(size * paddingPercent);

  const logoSize =
    size - padding * 2;

  /*
   * Resize the COMPLETE logo.
   *
   * No crop.
   * No circle mask.
   * No alteration of the logo itself.
   */
  await logo
    .clone()
    .resize(logoSize, logoSize, {
      fit: "contain",
    })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: {
        r: 0,
        g: 0,
        b: 0,
        alpha: 0,
      },
    })
    .png()
    .toFile(
      path.join(outputDir, filename)
    );

  console.log(`Created ${filename}`);
}

async function generate() {
  if (!fs.existsSync(source)) {
    throw new Error(
      `Logo not found: ${source}`
    );
  }

  const transparentLogo =
    await removeBackground();

  /*
   * Keep the CURRENT logo size.
   */

  await generateIcon(
    transparentLogo,
    "pwa-192.png",
    192,
    0.06
  );

  await generateIcon(
    transparentLogo,
    "pwa-512.png",
    512,
    0.06
  );

  await generateIcon(
    transparentLogo,
    "pwa-512-maskable.png",
    512,
    0.10
  );

  console.log(
    "\nPWA icons generated successfully."
  );
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});