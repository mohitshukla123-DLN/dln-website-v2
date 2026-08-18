import { useEffect, useState } from "react";
import type { HomepageSettings } from "../../types/homepage";
import type { Product } from "../../types/product";
import Container from "../ui/Container";
import CategoryCard from "./CategoryCard";
import { categories } from "../../data/categories";
import { getProducts } from "../../lib/products";

interface Props {settings: HomepageSettings | null;}

export default function CategoryGrid({ settings }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  if (settings?.featured_categories_enabled === false) {
    return null;
  }

  return (
    <section id="featured-categories" className="scroll-mt-20 bg-[var(--background)] py-12 sm:py-24">
      <Container>
        <div className="mb-8 text-center sm:mb-14">
          <h2 className="text-3xl font-bold sm:text-5xl">
            {settings?.featured_categories_title ||
              "Shop by Category"}
          </h2>

          <p className="mt-3 text-[var(--muted)] sm:mt-5">
            {settings?.featured_categories_subtitle ||
              "Explore our handcrafted collections."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              productImages={products
                .filter(
                  (product) =>
                    product.category?.toLowerCase() === category.name.toLowerCase()
                )
                .map((product) => product.image || product.images?.[0])
                .filter(Boolean)
              }
            />
          ))}
        </div>
      </Container>
    </section>
  );
}