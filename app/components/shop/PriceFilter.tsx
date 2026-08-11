interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PriceFilter({
  value,
  onChange,
}: Props) {
  return (
  <div className="flex flex-col gap-2">
    <label htmlFor="price" className="text-sm font-medium">
      Price
    </label>

    <select
      id="price"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-black/10 bg-white px-4 py-2 outline-none transition focus:border-[var(--teal)]"
    >
      <option value="all">All Prices</option>
      <option value="under-2000">Under ₹2,000</option>
      <option value="2000-5000">₹2,000 – ₹5,000</option>
      <option value="5000-10000">₹5,000 – ₹10,000</option>
      <option value="above-10000">Above ₹10,000</option>
    </select>
  </div>
);
}