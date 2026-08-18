import { sizes } from "../../data/sizes";

interface Props {
  selected: string;
  onSelect: (size: string) => void;
}

export default function SizeFilter({
  selected,
  onSelect,
}: Props) {
  return (
    <div className="mt-8 flex gap-3">
      <button
        onClick={() => onSelect("All")}
        className={`rounded-full px-4 py-2 ${
          selected === "All"
            ? "bg-[var(--burgundy)] text-white"
            : "border"
        }`}
      >
        All Sizes
      </button>

      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSelect(size)}
          className={`rounded-full border px-4 py-2 ${
            selected === size
              ? "bg-[var(--burgundy)] text-white"
              : ""
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}