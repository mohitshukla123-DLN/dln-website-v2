import { supabase } from "./supabase";

export interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  product_slug: string;
}

export async function getReviews(
  productSlug: string
): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_slug", productSlug)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data as Review[];
}