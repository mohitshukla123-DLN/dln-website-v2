import type { HomepageSettings } from "../../types/homepage";
import Container from "../ui/Container";
import CategoryCard from "./CategoryCard";
import { categories } from "../../data/categories";

interface Props {settings: HomepageSettings | null;}

export default function CategoryGrid({ settings }: Props) {
  if (settings?.featured_categories_enabled === false) {
    return null;
  }

  return (
    <section id="featured-categories" className="scroll-mt-20 bg-[#f3eee8] py-24">
      <Container>
        <div className="mb-14 text-center">
          <h2 className="text-5xl font-bold">
            {settings?.featured_categories_title ||
              "Shop by Category"}
          </h2>

          <p className="mt-5 text-[var(--muted)]">
            {settings?.featured_categories_subtitle ||
              "Explore our handcrafted collections."}
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