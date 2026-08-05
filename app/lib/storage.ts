import { supabase } from "./supabase";

export async function uploadProductImage(file: File) {
  const extension = file.name.split(".").pop();

  const fileName =
    crypto.randomUUID() + "." + extension;

  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: data.publicUrl,
  };
}