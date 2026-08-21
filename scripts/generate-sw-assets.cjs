const fs = require("fs");
const path = require("path");

const distDir = path.resolve("dist");
const output = path.resolve("public/sw-assets.js");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(full);
    }

    return [full];
  });
}

if (!fs.existsSync(distDir)) {
  console.error("dist directory not found");
  process.exit(1);
}

const assets = walk(distDir)
  .filter(file => {
    const relative = path.relative(distDir, file).replaceAll("\\", "/");

    return (
      relative.startsWith("assets/") &&
      /\.(js|css|woff2?|ttf|otf|svg|webp|png|jpe?g|gif)$/i.test(relative)
    );
  })
  .map(file => {
    const relative = path.relative(distDir, file).replaceAll("\\", "/");
    return `/${relative}`;
  });

fs.writeFileSync(
  output,
  `self.__SW_ASSETS__ = ${JSON.stringify(assets, null, 2)};\n`
);

console.log(`SW asset manifest generated: ${assets.length} assets`);
