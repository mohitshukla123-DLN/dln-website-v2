interface Props {
  sizes: string[];
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

export default function ProductSizes({
  sizes,
  selectedSize,
  setSelectedSize,
}: Props) {
  return (
    <div className="mt-10">
      <p className="mb-4 font-semibold">
        Select Size
      </p>

      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setSelectedSize(size)}
            className={`rounded-xl border px-5 py-3 transition ${
              selectedSize === size
                ? "border-[var(--teal)] bg-[var(--teal)] text-white"
                : "hover:border-[var(--teal)] hover:bg-[var(--teal)] hover:text-white"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}