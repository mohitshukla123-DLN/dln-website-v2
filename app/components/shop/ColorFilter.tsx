import { colors } from "../../data/colors";

interface Props {
  selected: string;
  onSelect: (color: string) => void;
}

export default function ColorFilter({
  selected,
  onSelect,
}: Props) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <button
        onClick={() => onSelect("All")}
        className={`rounded-full px-4 py-2 transition ${
          selected === "All"
            ? "bg-[var(--teal)] text-white"
            : "border"
        }`}
      >
        All Colors
      </button>

      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          className={`rounded-full border px-4 py-2 transition ${
            selected === color
              ? "bg-[var(--teal)] text-white"
              : "hover:border-[var(--teal)]"
          }`}
        >
          {color}
        </button>
      ))}
    </div>
  );
}