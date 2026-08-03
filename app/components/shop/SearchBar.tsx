interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by product, SKU, category, colour..."
        className="w-full rounded-2xl border border-black/10 px-5 py-4 outline-none transition focus:border-[var(--teal)]"
      />
    </div>
  );
}