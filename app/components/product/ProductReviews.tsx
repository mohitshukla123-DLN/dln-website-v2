import type { Review } from "../../lib/reviews";

interface Props {
  reviews: Review[];
}

export default function ProductReviews({
  reviews,
}: Props) {
  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold">
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-black/10 p-8 text-center">
          <p className="text-[var(--muted)]">
            No reviews yet.
          </p>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Be the first to review this product.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-black/10 p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {review.customer_name}
                </h3>

                <span className="text-yellow-500">
                  {"★".repeat(review.rating)}
                </span>
              </div>

              <p className="mt-4 text-[var(--muted)]">
                {review.comment}
              </p>

              <p className="mt-4 text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}