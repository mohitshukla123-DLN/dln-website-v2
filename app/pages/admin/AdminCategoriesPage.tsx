import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import { supabase } from "../../lib/supabase";
import AddCategoryModal from "../../components/admin/AddCategoryModal";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setCategories(data ?? []);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Container>
      <section className="py-16">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold">
              Categories
            </h1>

            <p className="mt-2 text-[var(--muted)]">
              Manage product categories
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-black px-5 py-3 text-white"
          >
            + Add Category
          </button>

        </div>

        <div className="overflow-hidden rounded-xl border bg-white">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Slug
                </th>

                <th className="p-4 text-left">
                  Description
                </th>

              </tr>

            </thead>

            <tbody>

              {categories.map((category) => (

                <tr
                  key={category.id}
                  className="border-t"
                >

                  <td className="p-4">
                    {category.name}
                  </td>

                  <td className="p-4">
                    {category.slug}
                  </td>

                  <td className="p-4">
                    {category.description}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

      <AddCategoryModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={loadCategories}
      />

    </Container>
  );
}