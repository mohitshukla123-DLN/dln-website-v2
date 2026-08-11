import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search by product, SKU, category, colour..."
        className="w-full rounded-2xl border border-black/10 px-5 py-4 outline-none transition focus:border-[var(--teal)]"
      />

      {focused && value.trim() && (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-black/10 bg-white p-4 shadow-xl">
          <p className="text-sm text-[var(--muted)]">
            Searching for “{value}”
          </p>
        </div>
      )}
    </div>
  );
}