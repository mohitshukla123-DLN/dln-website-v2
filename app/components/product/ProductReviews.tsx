interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface Props {
  reviews: Review[];
}

export default function ProductReviews({
  reviews,
}: Props) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold">
        Customer Reviews
      </h2>

      <div className="mt-8 space-y-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="rounded-2xl border border-black/10 p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {review.name}
              </h3>

              <span className="text-yellow-500">
                {"★".repeat(review.rating)}
              </span>
            </div>

            <p className="mt-4 text-[var(--muted)]">
              {review.comment}
            </p>

            <p className="mt-4 text-sm text-gray-500">
              {review.date}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}