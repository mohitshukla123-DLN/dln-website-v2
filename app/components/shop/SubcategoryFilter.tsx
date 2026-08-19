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
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-1 sm:gap-2">
      <button
        type="button"
        onClick={() => onSelect("All")}
        className={`flex w-full items-center rounded-xl px-1.5 py-0.5 text-left text-[9px] transition ${
          selected === "All"
            ? "bg-[var(--burgundy)] text-white"
            : "border border-black/10 hover:border-[var(--burgundy)] hover:bg-[var(--burgundy)]/5"
        }`}
      >
        All
      </button>

      {items.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onSelect(item)}
          className={`flex w-full items-center rounded-xl px-1.5 py-0.5 text-left text-[9px] transition ${
            selected === item
              ? "bg-[var(--burgundy)] text-white"
              : "border border-black/10 hover:border-[var(--burgundy)] hover:bg-[var(--burgundy)]/5"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}