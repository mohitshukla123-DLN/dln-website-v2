interface Props {
  sizes: Record<string, number>;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

export default function ProductSizes({
  sizes,
  selectedSize,
  setSelectedSize,
}: Props) {
  const allSizes = [
    "32",
    "34",
    "36",
    "38",
    "40",
    "42",
    "44",
    "46",
  ];

  return (
    <div className="mt-10">
      <p className="mb-4 font-semibold">
        Select Size
      </p>

      <div className="flex flex-wrap gap-3">
        {allSizes.map((size) => {
          const stock = Number(sizes?.[size] ?? 0);

          return (
            <button
              key={size}
              type="button"
              disabled={stock === 0}
              onClick={() => setSelectedSize(size)}
              className={`rounded-xl border px-5 py-3 transition
                ${
                  selectedSize === size
                    ? "border-[var(--burgundy)] bg-[var(--burgundy)] text-white"
                    : "hover:border-[var(--burgundy)] hover:bg-[var(--burgundy)] hover:text-white"
                }
                ${
                  stock === 0
                    ? "cursor-not-allowed opacity-40 hover:bg-white hover:text-black hover:border-gray-300"
                    : ""
                }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}