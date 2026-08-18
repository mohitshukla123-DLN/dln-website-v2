import { useEffect, useState } from "react";

import { getProducts } from "../lib/products";
import type { Product } from "../types/product";
import { getWishlist } from "../lib/wishlist";

import Container from "../components/ui/Container";
import ProductGrid from "../components/shop/ProductGrid";
import SEO from "../components/common/SEO";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<number[]>(getWishlist());

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

    window.addEventListener("wishlistUpdated", updateWishlist);
    window.addEventListener("storage", updateWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlist);
      window.removeEventListener("storage", updateWishlist);
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

      <section className="bg-[var(--burgundy)] py-8 text-white sm:py-10">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl font-semibold sm:text-5xl">
              Wishlist
            </h1>

            <p className="mt-2 text-white/80 sm:mt-3">
              Your saved products.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-[var(--background)] py-8 sm:py-12">
        <Container>
          {wishlistProducts.length > 0 ? (
            <ProductGrid products={wishlistProducts} />
          ) : (
            <div className="flex min-h-[45vh] items-center justify-center rounded-3xl border border-dashed p-10 text-center sm:p-16">
              <div>
                <h2 className="text-2xl font-semibold">
                  Your wishlist is empty
                </h2>

                <p className="mt-4 text-[var(--muted)]">
                  Save products by clicking the ❤️ icon.
                </p>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
