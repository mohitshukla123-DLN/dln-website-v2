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
    "Free Size",
  ];

  return (
    <div className="mt-4 sm:mt-5">
      <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold sm:text-base">
            Select Size{" "}
            <span className="font-normal text-[var(--muted)]">
              (Inches)
            </span>
          </p>

          <a
            href="/size-guide"
            className="text-sm font-medium text-[var(--burgundy)] underline underline-offset-4"
          >
            Size Guide
          </a>
        </div>

        <p className="mb-3 text-[11px] text-[var(--muted)] sm:text-xs">
          Measurements in inches
        </p>

      <div className="flex flex-wrap gap-2">
        {allSizes.map((size) => {
          const stock = Number(sizes?.[size] ?? 0);

          return (
            <button
              key={size === "Free Size" ? size : `${size}"`}
              type="button"
              disabled={stock === 0}
              onClick={() => setSelectedSize(size)}
              className={`min-w-[44px] rounded-lg border px-3 py-2 text-sm font-medium transition active:scale-[0.98] sm:min-w-[58px] sm:rounded-xl sm:px-4 sm:py-2.5
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