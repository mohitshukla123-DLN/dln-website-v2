interface Props {
  category: string;
  name: string;
  rating: number;
  reviews: number;
  price: number;
}

export default function ProductInfo({
  category,
  name,
  rating,
  reviews,
  price,
}: Props) {
  return (
    <>
      <p className="text-sm uppercase tracking-[0.35em] text-[var(--teal)]">
        {category}
      </p>

      <h1 className="mt-4 text-5xl font-bold">
        {name}
      </h1>

      <div className="mt-6 flex items-center gap-3">
        <span className="text-xl text-yellow-500">
          ★★★★★
        </span>

        <span className="text-sm text-[var(--muted)]">
          {rating} ({reviews} reviews)
        </span>
      </div>

      <p className="mt-6 text-4xl font-bold text-[var(--teal)]">
        ₹{price.toLocaleString("en-IN")}
      </p>
    </>
  );
}