import { useEffect, useMemo, useState } from "react";
import {
  createProductFAQ,
  deleteProductFAQ,
  getProductFAQs,
  reorderProductFAQs,
  updateProductFAQ,
  type FAQScope,
  type ProductFAQ,
} from "../../lib/productFaqs";
import { getCategories, type Category } from "../../lib/categories";
import { getProducts } from "../../lib/products";
import type { Product } from "../../types/product";

const emptyForm = {
  question: "",
  answer: "",
  scope_type: "all" as FAQScope,
  category_slug: "",
  product_slug: "",
  enabled: true,
};

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<ProductFAQ[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [faqData, categoryData, productData] = await Promise.all([
        getProductFAQs(),
        getCategories(),
        getProducts(),
      ]);

      setFaqs(faqData);
      setCategories(categoryData);
      setProducts(productData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load FAQs."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const sortedFaqs = useMemo(
    () =>
      [...faqs].sort(
        (a, b) =>
          a.sort_order - b.sort_order || a.id - b.id
      ),
    [faqs]
  );

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function editFAQ(faq: ProductFAQ) {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      scope_type: faq.scope_type,
      category_slug: faq.category_slug ?? "",
      product_slug: faq.product_slug ?? "",
      enabled: faq.enabled,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.question.trim() || !form.answer.trim()) {
      setError("Question and answer are required.");
      return;
    }

    if (
      form.scope_type === "category" &&
      !form.category_slug
    ) {
      setError("Select a category.");
      return;
    }

    if (
      form.scope_type === "product" &&
      !form.product_slug
    ) {
      setError("Select a product.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        scope_type: form.scope_type,
        category_slug:
          form.scope_type === "category"
            ? form.category_slug
            : null,
        product_slug:
          form.scope_type === "product"
            ? form.product_slug
            : null,
        enabled: form.enabled,
        sort_order:
          editingId === null
            ? sortedFaqs.length
            : sortedFaqs.find(
                  (faq) => faq.id === editingId
                )?.sort_order ?? 0,
      };

      if (editingId === null) {
        await createProductFAQ(payload);
      } else {
        await updateProductFAQ(editingId, payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save FAQ."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this FAQ?")) return;

    try {
      await deleteProductFAQ(id);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete FAQ."
      );
    }
  }

  async function moveFAQ(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;

    if (
      targetIndex < 0 ||
      targetIndex >= sortedFaqs.length
    ) {
      return;
    }

    const next = [...sortedFaqs];

    [next[index], next[targetIndex]] = [
      next[targetIndex],
      next[index],
    ];

    const reordered = next.map((faq, position) => ({
      id: faq.id,
      sort_order: position,
    }));

    setFaqs(
      next.map((faq, position) => ({
        ...faq,
        sort_order: position,
      }))
    );

    try {
      await reorderProductFAQs(reordered);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reorder FAQs."
      );
      await loadData();
    }
  }

  function scopeLabel(faq: ProductFAQ) {
    if (faq.scope_type === "all") {
      return "All Products";
    }

    if (faq.scope_type === "category") {
      const category = categories.find(
        (item) => item.slug === faq.category_slug
      );

      return `Category: ${category?.name ?? faq.category_slug}`;
    }

    const product = products.find(
      (item) => item.slug === faq.product_slug
    );

    return `Product: ${product?.name ?? faq.product_slug}`;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">
          Frequently Asked Questions
        </h1>

        <p className="mt-2 text-sm text-[var(--muted)]">
          Add, edit, delete and reorder FAQs for your product
          pages.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Question
            </label>

            <input
              value={form.question}
              onChange={(event) =>
                setForm({
                  ...form,
                  question: event.target.value,
                })
              }
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--burgundy)]"
              placeholder="Is this product ready to ship?"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Answer
            </label>

            <textarea
              value={form.answer}
              onChange={(event) =>
                setForm({
                  ...form,
                  answer: event.target.value,
                })
              }
              rows={5}
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--burgundy)]"
              placeholder="Enter the FAQ answer..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Show FAQ on
            </label>

            <select
              value={form.scope_type}
              onChange={(event) =>
                setForm({
                  ...form,
                  scope_type: event.target.value as FAQScope,
                  category_slug: "",
                  product_slug: "",
                })
              }
              className="w-full rounded-xl border border-black/10 px-4 py-3"
            >
              <option value="all">All Products</option>
              <option value="category">Specific Category</option>
              <option value="product">Specific Product</option>
            </select>
          </div>

          {form.scope_type === "category" && (
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category
              </label>

              <select
                value={form.category_slug}
                onChange={(event) =>
                  setForm({
                    ...form,
                    category_slug: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-black/10 px-4 py-3"
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.slug}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.scope_type === "product" && (
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Product
              </label>

              <select
                value={form.product_slug}
                onChange={(event) =>
                  setForm({
                    ...form,
                    product_slug: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-black/10 px-4 py-3"
              >
                <option value="">Select product</option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.slug}
                  >
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(event) =>
                setForm({
                  ...form,
                  enabled: event.target.checked,
                })
              }
            />

            Enabled
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[var(--burgundy)] px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId === null
                  ? "Add FAQ"
                  : "Update FAQ"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-black/10 px-6 py-3 font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-[var(--muted)]">
            Loading FAQs...
          </p>
        ) : sortedFaqs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm text-[var(--muted)]">
            No FAQs yet.
          </div>
        ) : (
          sortedFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-semibold">
                      {scopeLabel(faq)}
                    </span>

                    {!faq.enabled && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                        Disabled
                      </span>
                    )}
                  </div>

                  <h2 className="mt-3 font-semibold">
                    {faq.question}
                  </h2>

                  <p className="mt-2 whitespace-pre-line text-sm text-[var(--muted)]">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moveFAQ(index, -1)}
                    disabled={index === 0}
                    className="rounded-lg border border-black/10 px-3 py-2 text-sm disabled:opacity-30"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => moveFAQ(index, 1)}
                    disabled={
                      index === sortedFaqs.length - 1
                    }
                    className="rounded-lg border border-black/10 px-3 py-2 text-sm disabled:opacity-30"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => editFAQ(faq)}
                    className="rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(faq.id)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}