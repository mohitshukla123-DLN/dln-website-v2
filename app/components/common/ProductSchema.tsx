import { Helmet } from "react-helmet-async";

import type { Product } from "../../types/product";

interface Props {
  product: Product;
}

const SITE_URL = "https://dresslikenawaabs.pages.dev";

export default function ProductSchema({
  product,
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.name,

    image: product.images.map(
      (img) => `${SITE_URL}${img}`
    ),

    description: product.description,

    sku: product.sku,

    category: product.category,

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

    aggregateRating: {
      "@type": "AggregateRating",

      ratingValue: product.rating,

      reviewCount: product.reviews,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}