import { supabase } from "./supabase";
import type { Product } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products:", error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Failed to load product:", error);
    return null;
  }

  return data as Product;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load featured products:", error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getBestSellers(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("bestseller", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load best sellers:", error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getNewArrivals(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("new_arrival", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load new arrivals:", error);
    return [];
  }

  return (data ?? []) as Product[];
}