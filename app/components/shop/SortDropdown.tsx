interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({
  value,
  onChange,
}: Props) {
  return (
  <div className="flex flex-col gap-1.5">
    <label htmlFor="sort" className="text-xs font-medium">
      Sort By
    </label>

    <select
      id="sort"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 rounded-lg border border-black/10 bg-white px-2.5 text-[12px] outline-none transition focus:border-[var(--burgundy)] sm:h-auto sm:px-4 sm:py-2 sm:text-sm"
    >
      <option value="featured">Featured</option>
      <option value="newest">Newest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="name">Name (A–Z)</option>
    </select>
  </div>
);
}