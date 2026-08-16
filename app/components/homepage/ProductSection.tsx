import ProductGrid from "../shop/ProductGrid";
import type { Product } from "../../types/product";

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
}

export default function ProductSection({
  title,
  subtitle,
  products,
}: Props) {
  if (products.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold sm:text-4xl">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-4 text-[var(--muted)]">
            {subtitle}
          </p>
        )}
      </div>

      <ProductGrid products={products} />
    </section>
  );
}