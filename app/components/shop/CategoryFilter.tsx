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
    <div className="mb-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onSelect("All")}
        className={`rounded-full px-5 py-2 transition ${
          selected === "All"
            ? "bg-[var(--teal)] text-white"
            : "border hover:border-[var(--teal)]"
        }`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          type="button"
          key={category.id}
          onClick={() => onSelect(category.name)}
          className={`rounded-full px-5 py-2 transition ${
            selected === category.name
              ? "bg-[var(--teal)] text-white"
              : "border hover:border-[var(--teal)]"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}