const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const source = path.resolve(
  "app/assets/logos/logo-home-400.webp"
);

const outputDir = path.resolve("public");

async function generate() {
  if (!fs.existsSync(source)) {
    throw new Error(`Logo not found: ${source}`);
  }

  /*
   * Create a square canvas and fit the complete logo
   * inside it without cropping.
   *
   * The padding prevents Android/Chrome from zooming
   * into the logo when displaying the PWA icon.
   */
  const sizes = [
    {
      filename: "pwa-192.png",
      size: 192,
    },
    {
      filename: "pwa-512.png",
      size: 512,
    },
  ];

  for (const { filename, size } of sizes) {
    const padding = Math.round(size * 0.06);
    const logoSize = size - padding * 2;

    await sharp(source)
      .resize(logoSize, logoSize, {
        fit: "contain",
        withoutEnlargement: false,
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: {
          r: 255,
          g: 255,
          b: 255,
          alpha: 1,
        },
      })
      .png()
      .toFile(path.join(outputDir, filename));

    console.log(`Created ${filename}`);
  }

  /*
   * Maskable icon needs more safety padding because
   * Android may crop the edges into different shapes.
   */
  const maskableSize = 512;
  const maskablePadding = Math.round(
  maskableSize * 0.10
);

  const maskableLogoSize =
    maskableSize - maskablePadding * 2;

  await sharp(source)
    .resize(
      maskableLogoSize,
      maskableLogoSize,
      {
        fit: "contain",
        withoutEnlargement: false,
      }
    )
    .extend({
      top: maskablePadding,
      bottom: maskablePadding,
      left: maskablePadding,
      right: maskablePadding,
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 1,
      },
    })
    .png()
    .toFile(
      path.join(
        outputDir,
        "pwa-512-maskable.png"
      )
    );

  console.log(
    "Created pwa-512-maskable.png"
  );

  console.log("\nPWA icons generated successfully.");
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});