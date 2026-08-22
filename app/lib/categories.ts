import { supabase } from "./supabase";

export interface Category {
  id: number;
  name: string;
  slug: string;
  enabled?: boolean;
  sort_order?: number;

  image: string;
  banner: string;
  description: string;
  subCategories: string[];
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Failed to load categories:",
      error
    );

    return [];
  }

  return (data ?? []).map((category) => ({
    ...category,

    image: category.image ?? "",
    banner: category.banner ?? "",
    description: category.description ?? "",
    subCategories: category.subCategories ?? [],
  }));
}