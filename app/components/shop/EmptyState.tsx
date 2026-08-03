export default function EmptyState() {
  return (
    <div className="rounded-3xl border py-24 text-center">
      <h2 className="text-3xl font-bold">
        No products found
      </h2>

      <p className="mt-4 text-[var(--muted)]">
        Try selecting a different category or subcategory.
      </p>
    </div>
  );
}