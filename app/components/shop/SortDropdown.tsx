interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({
  value,
  onChange,
}: Props) {
  return (
  <div className="flex flex-col gap-2">
    <label htmlFor="sort" className="text-sm font-medium">
      Sort By
    </label>

    <select
      id="sort"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-black/10 bg-white px-4 py-2 outline-none transition focus:border-[var(--burgundy)]"
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