import { supabase } from "./supabase";
import type { HomepageSettings } from "../types/homepage";

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  const { data, error } = await supabase
    .from("homepage_settings")
    .select(`
        id,
        hero_enabled,
        hero_title,
        hero_subtitle,
        hero_button_text,
        hero_button_url,
        hero_image_url,
        featured_categories_enabled,
        featured_categories_title,
        featured_categories_subtitle,
        new_arrivals_enabled,
        new_arrivals_title,
        new_arrivals_subtitle,
        new_arrivals_count,
        featured_collections_enabled,
        featured_collections_title,
        featured_collections_subtitle,
        featured_collections_count,
        why_choose_us_enabled,
        why_choose_us_title,
        why_choose_us_subtitle,
        best_sellers_enabled,
        best_sellers_title,
        best_sellers_subtitle,
        best_sellers_count,
        testimonials_enabled,
        testimonials_title,
        testimonials_subtitle,
        newsletter_enabled,
        newsletter_title,
        newsletter_subtitle
      `)
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Failed to load homepage settings:", error);
    return null;
  }

  return data as HomepageSettings;
}