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
      <p className="text-sm uppercase tracking-[0.35em] text-[var(--burgundy)]">
        {category}
      </p>

      <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
        {name}
      </h1>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-xl text-yellow-500">
          ★★★★★
        </span>

        <span className="text-sm text-[var(--muted)]">
          {rating} ({reviews} reviews)
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold text-black sm:text-4xl">
        ₹{price.toLocaleString("en-IN")}
      </p>

      {color && (
        <p className="mt-3 text-sm text-[var(--muted)]">
          <span className="font-semibold text-[var(--foreground)]">
            Color:
          </span>{" "}
          {color}
        </p>
      )}
    </>
  );
}