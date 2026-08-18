interface Props {
  min: number;
  max: number;
  onChange: (range: { min: number; max: number }) => void;
}

const MIN_PRICE = 100;
const MAX_PRICE = 5000;
const STEP = 100;

function formatPrice(value: number) {
  return value >= MAX_PRICE
    ? `₹${MAX_PRICE.toLocaleString("en-IN")}+`
    : `₹${value.toLocaleString("en-IN")}`;
}

export default function PriceFilter({ min, max, onChange }: Props) {
  const handleMinChange = (value: number) =>
    onChange({ min: Math.min(value, max - STEP), max });

  const handleMaxChange = (value: number) =>
    onChange({ min, max: Math.max(value, min + STEP) });

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <label className="text-sm font-semibold uppercase tracking-[0.12em]">
          Price
        </label>
        <span className="text-xs text-[var(--muted)]">
          {formatPrice(min)} – {formatPrice(max)}
        </span>
      </div>

      <div className="relative h-8">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-black/10" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[var(--burgundy)]"
          style={{
            left: `${((min - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
            right: `${100 - ((max - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
          }}
        />

        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          value={min}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          aria-label="Minimum price"
          className="price-range absolute inset-0 z-20 h-8 w-full appearance-none bg-transparent"
        />

        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          value={max}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          aria-label="Maximum price"
          className="price-range absolute inset-0 z-10 h-8 w-full appearance-none bg-transparent"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]">
        <span>₹100</span>
        <span>₹{MAX_PRICE.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
