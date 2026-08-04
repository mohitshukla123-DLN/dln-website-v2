import { products } from "../data/products";
import { getWishlist } from "../lib/wishlist";

import Container from "../components/ui/Container";
import ProductGrid from "../components/shop/ProductGrid";

export default function WishlistPage() {
  const wishlist = getWishlist();

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  return (
    <>
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
          <ProductGrid products={wishlistProducts} />
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