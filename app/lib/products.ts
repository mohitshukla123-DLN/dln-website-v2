import { supabase } from "./supabase";
import type { Product } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
  console.error(error);
  return [] as Product[];
}

  return data;
}

export async function getProductBySlug(
  slug: string
) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;

  return data;
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true);

  if (error) return [] as Product[];

  return data;
}

export async function getNewArrivals() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(8);

  if (error) return [] as Product[];

  return data;
}