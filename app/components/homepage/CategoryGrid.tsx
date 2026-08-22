import { useEffect, useState } from "react";
import type { HomepageSettings } from "../../types/homepage";
import type { Product } from "../../types/product";
import Container from "../ui/Container";
import CategoryCard from "./CategoryCard";
import { getCategories, type Category as DbCategory } from "../../lib/categories";
import { getProducts } from "../../lib/products";

interface Props {
  settings: HomepageSettings | null;
}

export default function CategoryGrid({ settings }: Props) {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadData() {
      const [categoryData, productData] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);

      setCategories(categoryData);
      setProducts(productData);
    }

    loadData();
  }, []);

  if (settings?.featured_categories_enabled === false) {
    return null;
  }

  return (
    <section
      id="featured-categories"
      className="scroll-mt-20 bg-[var(--background)] py-8 sm:py-24"
    >
      <Container>
        <div className="mb-6 text-center sm:mb-14">
          <h2 className="text-3xl font-bold sm:text-5xl">
            {settings?.featured_categories_title || "Shop by Category"}
          </h2>

          <p className="mt-3 text-[var(--muted)] sm:mt-5">
            {settings?.featured_categories_subtitle ||
              "Explore our handcrafted collections."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-8 lg:grid-cols-4">
          {categories.map((category) => {
            const productImages = products
            .filter(
              (product) =>
                product.category?.trim().toLowerCase() ===
                category.name.trim().toLowerCase()
            )
            .map((product) => product.image || product.images?.[0])
            .filter(Boolean);

          const categoryImage =
            productImages[0] ||
            category.image ||
            category.banner ||
            "";

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
                productImages={productImages}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}