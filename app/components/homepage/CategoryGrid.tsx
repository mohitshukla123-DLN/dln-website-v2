import Container from "../ui/Container";

import CategoryCard from "./CategoryCard";

import { categories } from "../../data/categories";

export default function CategoryGrid() {
  return (
    <section className="py-24">
      <Container>

        <div className="mb-14 text-center">

          <h2 className="text-5xl font-bold">
            Shop by Category
          </h2>

          <p className="mt-5 text-[var(--muted)]">
            Explore our handcrafted collections.
          </p>

        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => (

            <CategoryCard
              key={category.id}
              category={category}
            />

          ))}

        </div>

      </Container>
    </section>
  );
}