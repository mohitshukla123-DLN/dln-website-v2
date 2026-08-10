import { supabase } from "./supabase";
import type { HomepageSettings } from "../types/homepage";

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  const { data, error } = await supabase
    .from("homepage_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Failed to load homepage settings:", error);
    return null;
  }

  return data as HomepageSettings;
}