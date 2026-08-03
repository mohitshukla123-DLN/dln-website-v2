export interface Collection {
  slug: string;
  title: string;
  description: string;
  badge?: "NEW" | "BESTSELLER" | "LIMITED" | "SALE";
}

export const collections: Collection[] = [
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    description: "Discover the latest additions to our collection.",
    badge: "NEW",
  },
  {
    slug: "best-sellers",
    title: "Best Sellers",
    description: "Our most loved styles.",
    badge: "BESTSELLER",
  },
  {
    slug: "sale",
    title: "Sale",
    description: "Limited time offers.",
    badge: "SALE",
  },
];