import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  enabled?: boolean;
  sort_order?: number;
}

interface Props {
  category: string;
  selected: string;
  onSelect: (subcategory: string) => void;
}

export default function SubcategoryFilter({
  category,
  selected,
  onSelect,
}: Props) {
  const [items, setItems] = useState<Subcategory[]>([]);

  useEffect(() => {
    async function loadSubcategories() {
      if (category === "All") {
        setItems([]);
        return;
      }

      const { data: categoryData, error: categoryError } =
        await supabase
          .from("categories")
          .select("id")
          .eq("name", category)
          .single();

      if (categoryError || !categoryData) {
        setItems([]);
        return;
      }

      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", categoryData.id)
        .order("sort_order", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Failed to load subcategories:",
          error
        );

        setItems([]);
        return;
      }

      setItems(data ?? []);
    }

    loadSubcategories();
  }, [category]);

  if (category === "All" || items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-1 sm:grid-cols-1 sm:gap-2">
      <button
        type="button"
        onClick={() => onSelect("All")}
        className={`flex w-full items-center rounded-lg px-2 py-1 text-left text-sm leading-4 transition sm:rounded-xl sm:px-1.5 sm:py-0.5 sm:text-sm ${
          selected === "All"
            ? "bg-[var(--burgundy)] text-white"
            : "border border-black/10 hover:border-[var(--burgundy)] hover:bg-[var(--burgundy)]/5"
        }`}
      >
        All
      </button>

      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={() => onSelect(item.name)}
          className={`flex w-full items-center rounded-lg px-2 py-1 text-left text-sm leading-4 transition sm:rounded-xl sm:px-1.5 sm:py-0.5 sm:text-sm ${
            selected === item.name
              ? "bg-[var(--burgundy)] text-white"
              : "border border-black/10 hover:border-[var(--burgundy)] hover:bg-[var(--burgundy)]/5"
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}