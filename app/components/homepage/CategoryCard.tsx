import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { Category } from "../../types/category";

interface Props {
  category: Category;
  productImages?: string[];
}

const palette = [
  "bg-[var(--surface)] hover:bg-[#f8eef1]",
];

export default function CategoryCard({ category, productImages = [] }: Props) {
  const images = useMemo(
    () => Array.from(new Set(productImages.filter(Boolean))),
    [productImages]
  );
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    setCurrentImage(0);
    if (images.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentImage((index) => (index + 1) % images.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [images.length]);
  const colorClass = "bg-[#f8eef1] sm:bg-[var(--surface)] sm:hover:bg-[#f3e5e9]";

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group overflow-hidden rounded-2xl border border-black/10 sm:rounded-3xl"
    >
      <div className="overflow-hidden">
        <img
          src={images[currentImage] ?? category.image}
          alt={category.name}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-80"
        />
      </div>

      <div className={`border border-black/10 py-3 text-center shadow-sm transition-colors duration-300 sm:py-5 ${colorClass}`}>
        <h3 className="text-[0.95rem] font-medium leading-5 text-[var(--foreground)] transition-colors group-hover:text-[var(--burgundy)] sm:text-[1.3rem] sm:leading-normal">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
