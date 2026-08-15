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
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => onSelect("All")}
        className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm transition ${
          selected === "All"
            ? "bg-[var(--teal)] text-white"
            : "border border-black/10 hover:border-[var(--teal)] hover:bg-[var(--teal)]/5"
        }`}
      >
        All
      </button>

      {items.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onSelect(item)}
          className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm transition ${
            selected === item
              ? "bg-[var(--teal)] text-white"
              : "border border-black/10 hover:border-[var(--teal)] hover:bg-[var(--teal)]/5"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}