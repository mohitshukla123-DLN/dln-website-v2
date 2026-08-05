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

  const ratingCounts = {
    5: reviews.filter(
      (r) => r.rating === 5
    ).length,
    4: reviews.filter(
      (r) => r.rating === 4
    ).length,
    3: reviews.filter(
      (r) => r.rating === 3
    ).length,
    2: reviews.filter(
      (r) => r.rating === 2
    ).length,
    1: reviews.filter(
      (r) => r.rating === 1
    ).length,
  };

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
          <div className="mt-8 space-y-4">
            {[5, 4, 3, 2, 1].map(
              (stars) => (
                <div
                  key={stars}
                  className="flex items-center gap-4"
                >
                  <span className="w-16 text-sm font-medium">
                    {"★".repeat(stars)}
                  </span>

                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-yellow-500"
                      style={{
                        width: `${
                          reviews.length ===
                          0
                            ? 0
                            : (ratingCounts[
                                stars as keyof typeof ratingCounts
                              ] /
                                reviews.length) *
                              100
                        }%`,
                      }}
                    />
                  </div>

                  <span className="w-6 text-right text-sm">
                    {
                      ratingCounts[
                        stars as keyof typeof ratingCounts
                      ]
                    }
                  </span>
                </div>
              )
            )}
          </div>

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
              {sortedReviews.map(
                (review, index) => (
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