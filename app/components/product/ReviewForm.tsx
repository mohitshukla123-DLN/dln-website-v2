import { useState } from "react";
import { supabase } from "../../lib/supabase";

interface Props {
  productSlug: string;
  onReviewAdded: () => void;
}

export default function ReviewForm({
  productSlug,
  onReviewAdded,
}: Props) {
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function submitReview(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (rating === 0) return;

    setLoading(true);

    const { error } = await supabase
      .from("reviews")
      .insert([
        {
          product_slug: productSlug,
          customer_name: customerName,
          rating,
          comment: "",
        },
      ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setCustomerName("");
    setRating(0);
    setShowForm(false);

    onReviewAdded();
  }

  return (
    <section className="mt-12 rounded-2xl border border-black/10 p-6">
      <h3 className="mb-4 text-2xl font-bold">
        Rate this Product
      </h3>

      <div className="flex gap-2 text-4xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() =>
              setHover(star)
            }
            onMouseLeave={() =>
              setHover(0)
            }
            onClick={() => {
              setRating(star);
              setShowForm(true);
            }}
            className="transition"
          >
            {star <= (hover || rating)
              ? "★"
              : "☆"}
          </button>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={submitReview}
          className="mt-6"
        >
          <input
            className="mb-4 w-full rounded-xl border p-3"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            required
          />

          <button
            disabled={loading}
            className="rounded-xl bg-[var(--teal)] px-6 py-3 text-white"
          >
            {loading
              ? "Submitting..."
              : "Submit Rating"}
          </button>
        </form>
      )}
    </section>
  );
}