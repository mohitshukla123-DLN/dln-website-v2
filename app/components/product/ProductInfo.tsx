interface Props {
  category: string;
  name: string;
  color: string;
  rating: number;
  reviews: number;
  price: number;
}

export default function ProductInfo({
  category,
  name,
  color,
  rating,
  reviews,
  price,
}: Props) {
  return (
    <>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--burgundy)] sm:text-xs sm:tracking-[0.28em]">
        {category}
      </p>

      <h1 className="mt-1.5 text-lg font-bold leading-tight sm:mt-3 sm:text-4xl lg:text-5xl">
        {name}
      </h1>

      <div className="mt-2 flex items-center gap-2 sm:mt-4 sm:gap-3">
        <span className="text-base text-yellow-500 sm:text-xl">
          ★★★★★
        </span>

        <span className="text-sm text-[var(--muted)]">
          {rating} ({reviews} reviews)
        </span>
      </div>

      <p className="mt-1.5 text-lg font-bold text-black sm:mt-4 sm:text-4xl">
        ₹{price.toLocaleString("en-IN")}
      </p>

      {color && (
        <p className="mt-2 text-xs text-[var(--muted)] sm:mt-3 sm:text-sm">
          <span className="font-semibold text-[var(--foreground)]">
            Color:
          </span>{" "}
          {color}
        </p>
      )}
    </>
  );
}