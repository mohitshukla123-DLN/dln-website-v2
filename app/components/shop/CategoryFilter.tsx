import { categories } from "../../data/categories";

interface Props {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({
  selected,
  onSelect,
}: Props) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => onSelect("All")}
        className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm transition ${
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
          className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm transition ${
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