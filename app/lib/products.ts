import { supabase } from "./supabase";

import type { Product } from "../types/product";

const PRODUCTS_CACHE_KEY = "dln-products-cache-v2";

function saveProductsToLocalCache(products: Product[]) {
  try {
    localStorage.setItem(
      PRODUCTS_CACHE_KEY,
      JSON.stringify(products)
    );
  } catch (error) {
    console.warn(
      "Failed to save products to local cache:",
      error
    );
  }
}

function getProductsFromLocalCache(): Product[] {
  try {
    const cached = localStorage.getItem(
      PRODUCTS_CACHE_KEY
    );

    if (!cached) {
      return [];
    }

    const parsed = JSON.parse(cached);

    return Array.isArray(parsed)
      ? (parsed as Product[])
      : [];
  } catch (error) {
    console.warn(
      "Failed to read products from local cache:",
      error
    );

    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  const pageSize = 1000;
  let from = 0;
  const allProducts: Product[] = [];

  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error(
        "Failed to load products from Supabase:",
        error
      );

      return getProductsFromLocalCache();
    }

    const page = (data ?? []) as Product[];

    allProducts.push(...page);

    if (page.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  saveProductsToLocalCache(allProducts);

  return allProducts;
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!error && data) {
    const product = data as Product;

    /*
     * Keep the individual product in the
     * local offline cache as well.
     */
    const cachedProducts =
      getProductsFromLocalCache();

    const existingIndex =
      cachedProducts.findIndex(
        (item) => item.id === product.id
      );

    if (existingIndex >= 0) {
      cachedProducts[existingIndex] = product;
    } else {
      cachedProducts.push(product);
    }

    saveProductsToLocalCache(cachedProducts);

    return product;
  }

  console.warn(
    "Supabase product lookup failed, checking local cache:",
    slug,
    error
  );

  /*
   * OFFLINE FALLBACK
   *
   * Find the product from the complete catalogue
   * previously saved while online.
   */
  const cachedProducts =
    getProductsFromLocalCache();

  const cachedProduct =
    cachedProducts.find(
      (item) => item.slug === slug
    );

  if (cachedProduct) {
    console.log(
      "Product served from local offline cache:",
      slug
    );

    return cachedProduct;
  }

  console.warn(
    "Product not available in local cache:",
    slug
  );

  return null;
}

export async function getFeaturedProducts(
  count?: number
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", {
      ascending: false,
    });

  if (count !== undefined) {
    query = query.limit(count);
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      "Failed to load featured products:",
      error
    );

    const cachedProducts =
      getProductsFromLocalCache();

    const featured = cachedProducts.filter(
      (product) => product.featured === true
    );

    return count !== undefined
      ? featured.slice(0, count)
      : featured;
  }

  return (data ?? []) as Product[];
}

export async function getBestSellers(
  count?: number
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .eq("bestseller", true)
    .order("created_at", {
      ascending: false,
    });

  if (count !== undefined) {
    query = query.limit(count);
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      "Failed to load best sellers:",
      error
    );

    const cachedProducts =
      getProductsFromLocalCache();

    const bestSellers =
      cachedProducts.filter(
        (product) => product.bestseller === true
      );

    return count !== undefined
      ? bestSellers.slice(0, count)
      : bestSellers;
  }

  return (data ?? []) as Product[];
}

export async function getNewArrivals(
  count?: number
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .eq("new_arrival", true)
    .order("created_at", {
      ascending: false,
    });

  if (count !== undefined) {
    query = query.limit(count);
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      "Failed to load new arrivals:",
      error
    );

    const cachedProducts =
      getProductsFromLocalCache();

    const newArrivals =
      cachedProducts.filter(
        (product) => product.badge === "NEW"
      );

    return count !== undefined
      ? newArrivals.slice(0, count)
      : newArrivals;
  }

  return (data ?? []) as Product[];
}