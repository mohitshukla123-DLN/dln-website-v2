import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../../lib/products";
import type { Product } from "../../types/product";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
    }

    load();
  }, []);

  const suggestions = useMemo(() => {
    if (value.trim() === "") return [];

    return products
      .filter((product) =>
        product.name
          .toLowerCase()
          .includes(value.toLowerCase())
      )
      .slice(0, 5);
  }, [products, value]);

  return (
    <div className="relative mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by product, SKU, category, colour..."
        className="w-full rounded-2xl border border-black/10 px-5 py-4 outline-none transition focus:border-[var(--teal)]"
      />

      {suggestions.length > 0 && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
          {suggestions.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              onClick={() => onChange("")}
              className="flex items-center gap-4 border-b border-black/5 p-4 transition hover:bg-black/5 last:border-b-0"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-16 w-16 rounded-xl object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold">
                  {product.name}
                </p>

                <p className="text-sm text-[var(--muted)]">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}