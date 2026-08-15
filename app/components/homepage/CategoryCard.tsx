import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { Category } from "../../types/category";

interface Props {
  category: Category;
  productImages?: string[];
}

const palette = [
  "bg-[#f2e5d5] hover:bg-[#dfc4a7]",
  "bg-[#eadce4] hover:bg-[#d6b7c8]",
  "bg-[#efe3bf] hover:bg-[#dfca88]",
  "bg-[#dfe9dc] hover:bg-[#bfd3b9]",
  "bg-[#e7ddd3] hover:bg-[#d2bda8]",
  "bg-[#e4e1d8] hover:bg-[#cfc9b8]",
  "bg-[#eadfd2] hover:bg-[#d6c0a7]",
  "bg-[#e7d9df] hover:bg-[#d1b4c2]",
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
    }, 2600);

    return () => window.clearInterval(interval);
  }, [images.length]);
  const colorClass = "bg-[var(--surface)] hover:bg-[#f8eef1]";

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group overflow-hidden rounded-2xl sm:rounded-3xl"
    >
      <div className="overflow-hidden">
        <img
          src={images[currentImage] ?? category.image}
          alt={category.name}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-80"
        />
      </div>

      <div className={`py-3 text-center shadow-sm transition-colors duration-300 sm:py-5 ${colorClass}`}>
        <h3 className="text-[0.95rem] font-medium leading-5 text-[var(--foreground)] transition-colors group-hover:text-[var(--teal)] sm:text-[1.3rem] sm:leading-normal">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
