import { supabase } from "./supabase";

export interface PolicySection {
  id: number;
  title: string;
  content: string;
  enabled: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export async function getPolicySections() {
  const { data, error } = await supabase
    .from("policy_sections")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw error;

  return (data ?? []) as PolicySection[];
}