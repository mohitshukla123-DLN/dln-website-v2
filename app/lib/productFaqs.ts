import { supabase } from "./supabase";

export type FAQScope = "all" | "category" | "product";

export interface ProductFAQ {
  id: number;
  question: string;
  answer: string;
  scope_type: FAQScope;
  category_slug: string | null;
  product_slug: string | null;
  sort_order: number;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateFAQInput {
  question: string;
  answer: string;
  scope_type: FAQScope;
  category_slug?: string | null;
  product_slug?: string | null;
  sort_order?: number;
  enabled?: boolean;
}

export async function getProductFAQs(): Promise<ProductFAQ[]> {
  const { data, error } = await supabase
    .from("product_faqs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function getFAQsForProduct(
  productSlug: string,
  categorySlug?: string | null
): Promise<ProductFAQ[]> {
  const { data, error } = await supabase
    .from("product_faqs")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw error;

  return (data ?? []).filter((faq) => {
    if (faq.scope_type === "all") {
      return true;
    }

    if (
      faq.scope_type === "category" &&
      categorySlug &&
      faq.category_slug === categorySlug
    ) {
      return true;
    }

    if (
      faq.scope_type === "product" &&
      faq.product_slug === productSlug
    ) {
      return true;
    }

    return false;
  });
}

export async function createProductFAQ(
  input: CreateFAQInput
): Promise<ProductFAQ> {
  const { data, error } = await supabase
    .from("product_faqs")
    .insert({
      question: input.question,
      answer: input.answer,
      scope_type: input.scope_type,
      category_slug:
        input.scope_type === "category"
          ? input.category_slug ?? null
          : null,
      product_slug:
        input.scope_type === "product"
          ? input.product_slug ?? null
          : null,
      sort_order: input.sort_order ?? 0,
      enabled: input.enabled ?? true,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateProductFAQ(
  id: number,
  input: Partial<CreateFAQInput>
): Promise<ProductFAQ> {
  const updates = {
    ...input,
    category_slug:
      input.scope_type === "category"
        ? input.category_slug ?? null
        : input.scope_type
          ? null
          : undefined,
    product_slug:
      input.scope_type === "product"
        ? input.product_slug ?? null
        : input.scope_type
          ? null
          : undefined,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("product_faqs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteProductFAQ(id: number) {
  const { error } = await supabase
    .from("product_faqs")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function reorderProductFAQs(
  items: Array<{ id: number; sort_order: number }>
) {
  for (const item of items) {
    const { error } = await supabase
      .from("product_faqs")
      .update({
        sort_order: item.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) throw error;
  }
}