export interface AdminProduct {
  id: number;

  name: string;

  slug: string;

  sku: string;

  category: string;

  subcategory: string | null;

  price: number;

  stock: number;

  featured: boolean;

  bestseller: boolean;

  new_arrival: boolean;

  badge: string | null;

  availability: string | null;

  description: string | null;

  fabric: string | null;

  embroidery: string | null;

  fit: string | null;

  occasion: string | null;

  care: string | null;

  sizes: string[];

  image: string | null;

  created_at?: string;

  updated_at?: string;
}