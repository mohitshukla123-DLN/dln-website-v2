import { subcategories } from "../../data/subcategories";

interface Props {
  category: string;
  selected: string;
  onSelect: (subcategory: string) => void;
}

export default function SubcategoryFilter({
  category,
  selected,
  onSelect,
}: Props) {
  if (category === "All") return null;

  const key = category.toLowerCase().replace(/\s+/g, "-");
  const items =
    subcategories[key as keyof typeof subcategories] ?? [];

  if (items.length === 0) return null;

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

      {items.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onSelect(item)}
          className={`rounded-full px-5 py-2 transition ${
            selected === item
              ? "bg-[var(--teal)] text-white"
              : "border hover:border-[var(--teal)]"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}