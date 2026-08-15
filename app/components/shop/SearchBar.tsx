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
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
    }

    load();
  }, []);

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();

    if (!query) return [];

    return products
      .filter((product) =>
        [
          product.name,
          product.sku,
          product.category,
          product.subcategory,
          product.color,
        ].some((field) =>
          field?.toLowerCase().includes(query)
        )
      )
      .slice(0, 5);
  }, [products, value]);

  return (
    <div className="relative mb-4 sm:mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder="Search by product, category, colour..."
        className="w-full rounded-2xl border border-black/10 px-5 py-4 outline-none transition focus:border-[var(--teal)]"
      />

      {focused && value.trim() && suggestions.length > 0 && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
          {suggestions.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              onClick={() => {
                onChange("");
                setFocused(false);
              }}
              className="flex items-center gap-4 border-b border-black/5 p-4 transition hover:bg-black/5 last:border-b-0"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-14 w-14 rounded-xl object-cover"
              />

              <div>
                <p className="font-semibold">{product.name}</p>
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