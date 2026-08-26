import { useEffect, useState } from "react";
import type { HomepageSettings } from "../../types/homepage";
import Container from "../ui/Container";
import CategoryCard from "./CategoryCard";
import {
  getCategories,
  type Category as DbCategory,
} from "../../lib/categories";
import { getProducts } from "../../lib/products";


interface Props {
  settings: HomepageSettings | null;
}

export default function CategoryGrid({ settings }: Props) {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [categoryImages, setCategoryImages] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    async function loadCategories() {
      const categoryData = await getCategories();
      setCategories(categoryData);

      const products = await getProducts();

      const imagesByCategory: Record<string, string[]> = {};

      for (const product of products) {
        const key = product.category?.trim().toLowerCase();
        if (!key) continue;

        const images = [
          ...(product.images ?? []),
          product.image,
        ].filter(
          (image): image is string =>
            typeof image === "string" && image.trim().length > 0
        );

        if (!imagesByCategory[key]) {
          imagesByCategory[key] = [];
        }

        imagesByCategory[key].push(...images);
      }

      for (const key of Object.keys(imagesByCategory)) {
        imagesByCategory[key] = Array.from(
          new Set(imagesByCategory[key])
        );
      }

      setCategoryImages(imagesByCategory);
    }

    loadCategories();
  }, []);

  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="mb-6 text-center sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--burgundy)]">
            Featured Categories
          </p>

          <h2 className="mt-2 font-serif text-xl font-bold leading-tight tracking-normal sm:mt-4 sm:text-4xl">
            Explore Our Collections
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {categories.map((category) => {
            const categoryImage =
              category.image?.trim() ||
              category.banner?.trim() ||
              "";

            const productImages =
              categoryImages[category.name.toLowerCase()] ?? [];

            return (
              <CategoryCard
                key={category.id}
                category={{
                  id: String(category.id),
                  name: category.name,
                  slug: category.slug,
                  image: categoryImage,
                  banner: categoryImage,
                  description: "",
                  subCategories: [],
                }}
                productImages={
                    categoryImages[category.name.trim().toLowerCase()] ?? []
                  }
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}