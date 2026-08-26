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
    <section className="mt-6 sm:mt-16">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
      <div className="min-w-0">
        <h2 className="text-lg font-bold sm:text-3xl">
          Customer Ratings
        </h2>

        <p className="mt-0.5 text-[11px] text-[var(--muted)] sm:mt-2 sm:text-base">
          Based on {reviews.length}{" "}
          {reviews.length === 1 ? "Rating" : "Ratings"}
        </p>
      </div>

      {reviews.length > 0 && (
        <div className="shrink-0 text-right">
          <div className="text-base tracking-wide text-yellow-500 sm:text-3xl">
            {"★".repeat(Math.round(Number(average)))}
          </div>

          <p className="text-xs font-semibold sm:text-lg">
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
          <div className="mt-3 space-y-2 sm:mt-8 sm:space-y-4">
            {[5, 4, 3, 2, 1].map(
              (stars) => (
                <div
                  key={stars}
                  className="flex items-center gap-2 sm:gap-4"
                >
                  <span className="w-12 text-xs font-medium sm:w-16 sm:text-sm">
                    {"★".repeat(stars)}
                  </span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 sm:h-3">
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

                  <span className="w-5 text-right text-xs sm:w-6 sm:text-sm">
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

          <div className="mt-3 text-center sm:mt-8">
            <button
              type="button"
              onClick={() =>
                setExpanded(!expanded)
              }
              className="rounded-lg border border-black/10 px-3 py-2 text-xs font-medium transition hover:bg-gray-50 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
            >
              {expanded
                ? "▲ Hide Individual Ratings"
                : "▼ View Individual Ratings"}
            </button>
          </div>

          {expanded && (
            <div className="mt-5 space-y-3 sm:mt-8 sm:space-y-4">
              {sortedReviews.map(
                (review, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-black/10 p-4 sm:p-5"
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