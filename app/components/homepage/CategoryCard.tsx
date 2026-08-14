import { Link } from "react-router-dom";

import type { Category } from "../../types/category";

interface Props {
  category: Category;
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

export default function CategoryCard({ category }: Props) {
  const colorClass = palette[Math.abs(category.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % palette.length];

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group overflow-hidden rounded-3xl"
    >
      <div className="overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className={`py-5 text-center shadow-sm transition-colors duration-300 ${colorClass}`}>
        <h3 className="text-xl font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--foreground)]">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
