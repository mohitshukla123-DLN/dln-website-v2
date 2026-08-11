import { useEffect, useMemo, useState } from "react";

import Container from "../components/ui/Container";

import SearchBar from "../components/shop/SearchBar";
import CategoryFilter from "../components/shop/CategoryFilter";
import SubcategoryFilter from "../components/shop/SubcategoryFilter";
import SortDropdown from "../components/shop/SortDropdown";
import ProductGrid from "../components/shop/ProductGrid";
import EmptyState from "../components/shop/EmptyState";

import { getProducts } from "../lib/products";
import { useSearchParams } from "react-router-dom";
import SEO from "../components/common/SEO";
import PriceFilter from "../components/shop/PriceFilter";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All");
  const [subcategory, setSubcategory] = useState(searchParams.get("subcategory") ?? "All");
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
  const params = new URLSearchParams();

  if (category !== "All") {
    params.set("category", category);
  }

  if (subcategory !== "All") {
    params.set("subcategory", subcategory);
  }

  setSearchParams(params);
}, [category, subcategory, setSearchParams]);


  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();

      setProducts(data);
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch =
        search === "" ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(search.toLowerCase()) ||
        product.color.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      const matchesSubcategory =
        subcategory === "All" ||
        product.subcategory === subcategory;

        const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-2000" &&
          product.price < 2000) ||
        (priceRange === "2000-5000" &&
          product.price >= 2000 &&
          product.price <= 5000) ||
        (priceRange === "5000-10000" &&
          product.price > 5000 &&
          product.price <= 10000) ||
        (priceRange === "above-10000" &&
          product.price > 10000);
      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesPrice
      );
    });

    switch (sort) {
      case "price-low":
        return [...result].sort(
          (a, b) => a.price - b.price
        );

      case "price-high":
        return [...result].sort(
          (a, b) => b.price - a.price
        );

      case "name":
        return [...result].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

      default:
        return result;
    }
      }, [
        products,
        search,
        category,
        subcategory,
        sort,
        priceRange,
      ]);

  function handleCategory(categoryName: string) {
    setCategory(categoryName);
    setSubcategory("All");
  }


  return (

    <>
    <SEO
      title="Shop"
      description="Browse premium Kurtis, Sarees, Shararas, Co-ord Sets, Jackets and more from Dress Like Nawaabs."
      canonical="https://dresslikenawaabs.pages.dev/shop"
    />

    <section className="py-20">
      <Container>
        <div className="mb-12">
          <h1 className="text-5xl font-bold">
            Shop
          </h1>

          <p className="mt-4 text-[var(--muted)]">
            Browse our premium collection.
          </p>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <CategoryFilter
          selected={category}
          onSelect={handleCategory}
        />

        <SubcategoryFilter
          category={category}
          selected={subcategory}
          onSelect={setSubcategory}
        />

        <PriceFilter
          value={priceRange}
          onChange={setPriceRange}
        />

        <SortDropdown
          value={sort}
          onChange={setSort}
        />

        <p className="mb-8 text-sm text-[var(--muted)]">
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""} found
        </p>

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <EmptyState />
        )}
            </Container>
    </section>
  </>
  );
}
    