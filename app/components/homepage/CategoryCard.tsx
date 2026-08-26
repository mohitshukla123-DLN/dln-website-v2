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
  () =>
    Array.from(
      new Set(
        [
          category.image,
          category.banner,
          ...productImages,
        ].filter(Boolean)
      )
    ),
  [category.image, category.banner, productImages]
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
    className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md sm:rounded-3xl"
  >
    <div className="aspect-[4/5] w-full overflow-hidden bg-[var(--surface)]">
      {images.length > 0 || category.image || category.banner ? (
        <img
          src={images[currentImage] || category.image || category.banner}
          alt={category.name}
          className="block h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[var(--surface)]">
          <span className="px-4 text-center text-lg font-medium text-[var(--foreground)]">
            {category.name}
          </span>
        </div>
      )}
    </div>

    <div
      className={`border-t border-black/10 px-2 py-2 text-center transition-colors duration-300 sm:px-3 sm:py-3 ${colorClass}`}
    >
      <h3 className="truncate text-[0.82rem] font-medium leading-4 text-[var(--foreground)] transition-colors group-hover:text-[var(--burgundy)] sm:text-[1.05rem] sm:leading-5">
        {category.name}
      </h3>
    </div>
  </Link>
);
}
