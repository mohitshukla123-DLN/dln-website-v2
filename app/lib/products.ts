import { supabase } from "./supabase";
import type { Product } from "../types/product";

function mapProduct(row: any): Product {
  return {
    id: row.id,

    slug: row.slug,
    sku: row.sku,

    name: row.name,

    category: row.category,
    subcategory: row.subcategory ?? "",

    subCategory: row.subcategory ?? "",

    color: "Default",

    price: row.price,

    image: row.image,

    images: row.image ? [row.image] : [],

    featured: row.featured ?? false,
    bestseller: row.bestseller ?? false,

    rating: 5,
    reviews: 0,

    description: row.description ?? "",

    material: row.fabric ?? "",
    work: row.embroidery ?? "",
    collection: row.occasion ?? "",

    availability: row.availability ?? "In Stock",

    badge: row.badge ?? undefined,

    stock: row.stock ?? 0,

    sizes: row.sizes ?? {},

    specifications: {
      fabric: row.fabric ?? "",
      embroidery: row.embroidery ?? "",
      fit: row.fit ?? "",
      occasion: row.occasion ?? "",
      care: row.care ?? "",
    },
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map(mapProduct);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

    console.log("Slug requested:", slug);
    console.log("Supabase returned:", data);
    console.log("Supabase error:", error);

  if (error || !data) return null;

  return mapProduct(data);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true);

  if (error) return [];

  return (data ?? []).map(mapProduct);
}

export async function getNewArrivals(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(8);

  if (error) return [];

  return (data ?? []).map(mapProduct);
}