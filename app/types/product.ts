export interface Product {
  id: number;

  slug: string;

  sku: string;

  name: string;

  category: string;

  subcategory: string;

  subCategory?: string;

  color: string;

  price: number;

  image: string;

  images: string[];

  featured: boolean;

  bestseller: boolean;

  /**
   * Product badge shown on cards.
   * Example:
   * "NEW"
   * "BESTSELLER"
   * "LIMITED"
   * "SALE"
   */

  rating: number;

  reviews: number;

  description: string;

  material?: string;

  work?: string;

  collection?: string;

  availability?:
  | "In Stock"
  | "Made to Order"
  | "Sold Out";

badge?:
  | "NEW"
  | "BESTSELLER"
  | "LIMITED"
  | "SALE";

stock?: number;

  sizes: Record<string, number>;

    fabric?: string;
    embroidery?: string;
    fit?: string;
    occasion?: string;
    care?: string;

    specifications: {
      fabric: string;
      embroidery?: string;
      fit: string;
      occasion: string;
      care: string;
    };
}