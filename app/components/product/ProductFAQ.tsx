import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../../lib/products";
import {
  getFAQsForProduct,
  type ProductFAQ as FAQ,
} from "../../lib/productFaqs";

export default function ProductFAQ() {
  const { slug } = useParams();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFAQs() {
      if (!slug) {
        setFaqs([]);
        setLoading(false);
        return;
      }

      try {
        const product = await getProductBySlug(slug);

        if (!product) {
          setFaqs([]);
          return;
        }

        const categorySlug = product.category
          ?.toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        setFaqs(
          await getFAQsForProduct(
            product.slug,
            categorySlug
          )
        );
      } catch (error) {
        console.error("Failed to load product FAQs:", error);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    }

    loadFAQs();
  }, [slug]);

  if (loading || faqs.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold sm:text-3xl">
        Frequently Asked Questions
      </h2>

      <div className="mt-8 space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.id}
            className="rounded-2xl border border-black/10 p-5"
          >
            <summary className="cursor-pointer font-semibold">
              {faq.question}
            </summary>

            <p className="mt-4 whitespace-pre-line text-[var(--muted)]">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
