import { useEffect, useState } from "react";

import { getProducts } from "../lib/products";
import type { Product } from "../types/product";
import { getWishlist } from "../lib/wishlist";

import Container from "../components/ui/Container";
import ProductGrid from "../components/shop/ProductGrid";
import SEO from "../components/common/SEO";

export default function WishlistPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [wishlist, setWishlist] =
    useState<number[]>(getWishlist());

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
    }

    load();
  }, []);

  useEffect(() => {
    function updateWishlist() {
      setWishlist(getWishlist());
    }

    window.addEventListener(
      "wishlistUpdated",
      updateWishlist
    );

    window.addEventListener(
      "storage",
      updateWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        updateWishlist
      );

      window.removeEventListener(
        "storage",
        updateWishlist
      );
    };
  }, []);

  const wishlistProducts = products.filter(
    (product) => wishlist.includes(product.id)
  );

  return (
    <>

      <SEO
          title="Wishlist"
          description="View your saved Dress Like Nawaabs products."
          canonical="https://dresslikenawaabs.pages.dev/wishlist"
        />

      <section className="py-20">
        <Container>
          <div className="mb-12">
            <h1 className="text-5xl font-bold">
              Wishlist
            </h1>

            <p className="mt-4 text-[var(--muted)]">
              Your saved products.
            </p>
          </div>

          {wishlistProducts.length > 0 ? (
            <ProductGrid
              products={wishlistProducts}
            />
          ) : (
            <div className="rounded-3xl border border-dashed p-16 text-center">
              <h2 className="text-2xl font-semibold">
                Your wishlist is empty
              </h2>

              <p className="mt-4 text-[var(--muted)]">
                Save products by clicking the ❤️ icon.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}