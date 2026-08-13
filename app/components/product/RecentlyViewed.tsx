import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../../lib/products";
import { buildWhatsAppLink } from "../../lib/whatsapp";
import type { Product } from "../../types/product";

function WhatsAppLink({
  product,
}: {
  product: Product;
}) {

  return (
    <a
      href={buildWhatsAppLink(
          product.name,
          "",
          product.price,
          product.slug
        )}
      target="_blank"
      rel="noopener noreferrer"
      className="min-w-0 flex-1"
    >
      <button
        type="button"
        className="w-full rounded-full bg-[var(--teal)] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90"
      >
        WhatsApp
      </button>
    </a>
  );
}

interface Props {
  currentSlug: string;
}

export default function RecentlyViewed({
  currentSlug,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [viewed, setViewed] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    ) as string[];

    setViewed(stored);

    async function load() {
      const data = await getProducts();
      setProducts(data);
    }

    load();
  }, []);

  const recentProducts = viewed
    .filter((slug) => slug !== currentSlug)
    .map((slug) =>
      products.find((product) => product.slug === slug)
    )
    .filter((product): product is Product => Boolean(product))
    .slice(0, 4);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-24 pb-16">
      <h2 className="mb-10 text-4xl font-bold">
        Recently Viewed
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {recentProducts.map((product) => {
          const image =
            Array.isArray(product.images) && product.images.length > 0
              ? product.images[0]
              : product.image || "";

          return (
            <article
              key={product.id}
              className="group overflow-hidden rounded-3xl border border-black/10 bg-white"
            >
              {image ? (
                <Link to={`/products/${product.slug}`}>
                  <img
                    src={image}
                    alt={product.name}
                    className="h-[470px] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </Link>
              ) : (
                <div className="flex h-[470px] items-center justify-center bg-[var(--background)] text-[var(--muted)]">
                  No image
                </div>
              )}

              <div className="p-6">
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--teal)]">
                  {product.category}
                </p>

                <h3 className="text-2xl font-semibold">
                  {product.name}
                </h3>

                <p className="mt-4 text-xl font-medium">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                {product.badge && (
                  <span className="mt-4 inline-block rounded-full bg-black px-4 py-2 text-xs font-medium text-white">
                    {product.badge}
                  </span>
                )}

                    <div className="mt-6 flex items-stretch gap-3">
                      <Link
                        to={`/products/${product.slug}`}
                        className="min-w-0 flex-1"
                      >
                        <button
                          type="button"
                          className="flex min-h-[52px] w-full items-center justify-center rounded-full bg-[var(--teal)] px-3 py-3 text-center text-sm font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90"
                        >
                          View Details
                        </button>
                      </Link>

                      <div className="min-w-0 flex-1">
                        <WhatsAppLink product={product} />
                      </div>
                    </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}