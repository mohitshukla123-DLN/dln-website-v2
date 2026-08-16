const faqs = [
  {
    question: "Is this product ready to ship?",
    answer:
      "Most products are in stock. Made-to-order products are stitched after confirmation.",
  },
        {
          question: "How do I choose the correct size?",
          answer:
            <>
        Please refer to our{" "}
        <a
          href="/size-guide"
          className="font-semibold text-[var(--teal)] underline"
        >
          Size Guide
        </a>{" "}
        before placing your enquiry.
      </>
  },
  {
    question: "Can I customize the design or size?",
    answer:
      "Yes. Selected products can be customized based on availability.",
  },
  {
    question: "How should I care for this garment?",
    answer:
      "We recommend dry cleaning to preserve the embroidery and fabric quality.",
  },
];

export default function ProductFAQ() {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold sm:text-3xl">
        Frequently Asked Questions
      </h2>

      <div className="mt-8 space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="rounded-2xl border border-black/10 p-5"
          >
            <summary className="cursor-pointer font-semibold">
              {faq.question}
            </summary>

            <p className="mt-4 text-[var(--muted)]">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}