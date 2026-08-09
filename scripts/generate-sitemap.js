import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const BASE_URL = "https://dresslikenawaabs.pages.dev";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables."
  );
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const categories = [
  "kurti",
  "short-kurti",
  "saree",
  "legging",
  "suit-piece",
  "pants",
  "plazo",
  "sharara",
  "garara",
  "jacket",
  "kurti-set",
  "coord-set",
  "gown",
];

const collections = [
  "new-arrivals",
  "best-sellers",
  "sale",
];

async function generateSitemap() {
  const { data: products, error } = await supabase
    .from("products")
    .select("slug")
    .not("slug", "is", null)
    .neq("slug", "");

  if (error) {
    throw new Error(
      `Failed to fetch products from Supabase: ${error.message}`
    );
  }

  const productUrls = (products || [])
    .map((product) => product.slug?.trim())
    .filter(Boolean)
    .map((slug) => `/products/${encodeURIComponent(slug)}`);

  const urls = [
    "/",
    "/shop",
    "/new-arrivals",
    "/about",
    "/contact",
    "/size-guide",
    "/policies",

    ...categories.map(
      (slug) => `/category/${slug}`
    ),

    ...collections.map(
      (slug) => `/collections/${slug}`
    ),

    ...productUrls,
  ];

  const uniqueUrls = [...new Set(urls)];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map(
    (url) => `  <url>
    <loc>${BASE_URL}${url}</loc>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const outputPath = path.resolve(
    "public/sitemap.xml"
  );

  fs.writeFileSync(
    outputPath,
    sitemap,
    "utf8"
  );

  console.log(
    `Sitemap generated successfully with ${uniqueUrls.length} URLs.`
  );

  console.log(
    `Products included: ${productUrls.length}`
  );

  console.log(
    `Output: ${outputPath}`
  );
}

generateSitemap().catch((error) => {
  console.error(error);
  process.exit(1);
});