import { Link } from "react-router-dom";

import type { Category } from "../../types/category";

interface Props {
  category: Category;
}

export default function CategoryCard({
  category,
}: Props) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group overflow-hidden rounded-3xl"
    >
      <div className="overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      <div className="bg-white py-6 text-center shadow transition group-hover:bg-[var(--teal)] group-hover:text-white">
        <h3 className="text-xl font-semibold">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}