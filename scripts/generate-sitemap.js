import fs from "fs";
import path from "path";

const BASE_URL = "https://dresslikenawaabs.pages.dev";

const products = JSON.parse(
  fs.readFileSync(path.resolve("src/data/products.json"), "utf8")
);

const categories = JSON.parse(
  fs.readFileSync(path.resolve("src/data/categories.json"), "utf8")
);

const collections = JSON.parse(
  fs.readFileSync(path.resolve("src/data/collections.json"), "utf8")
);

const urls = [
  "/",
  "/shop",
  "/new-arrivals",
  "/about",
  "/contact",
  "/size-guide",
  "/policies",
  ...categories.map((c) => `/category/${c.slug}`),
  ...collections.map((c) => `/collections/${c.slug}`),
  ...products.map((p) => `/products/${p.slug}`),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${BASE_URL}${url}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

fs.writeFileSync(path.resolve("public/sitemap.xml"), sitemap);

console.log("Sitemap generated successfully.");