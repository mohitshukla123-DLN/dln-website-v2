import { Helmet } from "react-helmet-async";

import type { Product } from "../../types/product";

interface Props {
  product: Product;
}

const SITE_URL = "https://dresslikenawaabs.pages.dev";

function absoluteUrl(value: string) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

export default function ProductSchema({ product }: Props) {
  const images = (product.images ?? [])
    .map(absoluteUrl)
    .filter(Boolean);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.name,

    ...(images.length > 0 ? { image: images } : {}),

    description: product.description,

    ...(product.sku ? { sku: product.sku } : {}),

    ...(product.category
      ? { category: product.category }
      : {}),

    brand: {
      "@type": "Brand",
      name: "Dress Like Nawaabs",
    },

    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.availability === "Sold Out"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  if (
    product.rating != null &&
    product.reviews != null &&
    Number(product.reviews) > 0
  ) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(product.rating),
      reviewCount: Number(product.reviews),
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}