import { useEffect, useState } from "react";
import { getCategories, type Category } from "../../lib/categories";

interface Props {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({
  selected,
  onSelect,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-1 sm:grid-cols-1 sm:gap-2">
      <button
        type="button"
        onClick={() => onSelect("All")}
        className={`flex w-full items-center rounded-lg px-2 py-1 text-left text-[10px] leading-4 transition sm:rounded-xl sm:px-1.5 sm:py-0.5 sm:text-[9px] ${
          selected === "All"
            ? "bg-[var(--burgundy)] text-white"
            : "border border-black/10 hover:border-[var(--burgundy)] hover:bg-[var(--burgundy)]/5"
        }`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          type="button"
          key={category.id}
          onClick={() => onSelect(category.name)}
          className={`flex w-full items-center rounded-xl px-1.5 py-0.5 text-left text-[9px] transition ${
            selected === category.name
              ? "bg-[var(--burgundy)] text-white"
              : "border border-black/10 hover:border-[var(--burgundy)] hover:bg-[var(--burgundy)]/5"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}