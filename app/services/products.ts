import { supabase } from "../lib/supabase";
import type { Product } from "../types/product";

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

export async function getBestsellerProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("bestseller", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load bestseller products:", error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getNewArrivalProducts(): Promise<Product[]> {
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