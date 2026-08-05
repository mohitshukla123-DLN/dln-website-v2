import { useState } from "react";

interface Review {
  customer_name: string;
  rating: number;
}

interface Props {
  reviews: Review[];
}

export default function ProductReviews({
  reviews,
}: Props) {
  const [expanded, setExpanded] =
    useState(false);

  const average =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  const sortedReviews = [...reviews].sort(
    (a, b) => b.rating - a.rating
  );

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Customer Ratings
          </h2>

          <p className="mt-2 text-[var(--muted)]">
            Based on {reviews.length}{" "}
            {reviews.length === 1
              ? "Rating"
              : "Ratings"}
          </p>
        </div>

        {reviews.length > 0 && (
          <div className="text-right">
            <div className="text-3xl text-yellow-500">
              {"★".repeat(
                Math.round(Number(average))
              )}
            </div>

            <p className="font-semibold text-lg">
              {average} / 5
            </p>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-8 text-[var(--muted)]">
          No ratings yet. Be the first to
          rate this product.
        </p>
      ) : (
        <>
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() =>
                setExpanded(!expanded)
              }
              className="rounded-xl border border-black/10 px-5 py-3 font-medium transition hover:bg-gray-50"
            >
              {expanded
                ? "▲ Hide Individual Ratings"
                : "▼ View Individual Ratings"}
            </button>
          </div>

          {expanded && (
            <div className="mt-8 space-y-4">
              {sortedReviews.map((review, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-black/10 p-5"
                  >
                    <span className="font-medium">
                      {
                        review.customer_name
                      }
                    </span>

                    <span className="text-yellow-500">
                      {"★".repeat(
                        review.rating
                      )}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}