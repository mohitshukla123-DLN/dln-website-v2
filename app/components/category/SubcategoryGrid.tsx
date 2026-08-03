interface Props {
  items: string[];
}

export default function SubcategoryGrid({
  items,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section className="py-14">
      <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <button
            key={item}
            className="rounded-full border px-6 py-3 hover:bg-black hover:text-white transition"
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}