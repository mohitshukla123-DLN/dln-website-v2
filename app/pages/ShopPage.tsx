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
  const [priceRange, setPriceRange] = useState({ min: 100, max: 5000 });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    try {
      setLoading(true);
      setLoadError(false);

      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load shop products:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  loadProducts();
}, []);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const query = search.trim().toLowerCase();

        const matchesSearch =
          query === "" ||
          String(product.name ?? "").toLowerCase().includes(query) ||
          String(product.sku ?? "").toLowerCase().includes(query) ||
          String(product.category ?? "").toLowerCase().includes(query) ||
          String(product.subcategory ?? "").toLowerCase().includes(query) ||
          String(product.color ?? "").toLowerCase().includes(query);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      const matchesSubcategory =
        subcategory === "All" ||
        product.subcategory === subcategory;

      const matchesPrice =
        product.price >= priceRange.min &&
        product.price <= priceRange.max;
      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesPrice
      );
    });

    switch (sort) {

      case "newest":
        return [...result].sort(
          (a, b) =>
            new Date(b.created_at ?? 0).getTime() -
            new Date(a.created_at ?? 0).getTime()
        );

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

    <section className="py-10 sm:py-16 lg:py-20">
      <Container className="max-w-[1600px]">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl font-bold sm:text-5xl">
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

        <div className="mb-8 lg:mb-10">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            className="mb-4 flex w-full items-center justify-between rounded-2xl border border-black/10 bg-white px-5 py-4 text-left shadow-sm lg:hidden"
          >
            <span className="font-semibold">Filters & Sort</span>
            <span className="text-xl text-[var(--muted)]" aria-hidden="true">
              {filtersOpen ? "−" : "+"}
            </span>
          </button>

          <div className={`grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start ${filtersOpen ? "" : ""}`}>
          <aside className={`${filtersOpen ? "block" : "hidden"} space-y-5 rounded-3xl border border-black/5 bg-white p-5 shadow-sm lg:sticky lg:top-28 lg:block`}>
            <div>
              <h2 className="text-xl font-semibold">Filters</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Refine your collection.</p>
            </div>

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
              min={priceRange.min}
              max={priceRange.max}
              onChange={setPriceRange}
            />

            <SortDropdown
              value={sort}
              onChange={setSort}
            />
          </aside>

          <div className="min-w-0">
            <p className="mb-8 text-sm text-[var(--muted)]">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} found
            </p>

            {loading ? (
              <div className="rounded-3xl border py-24 text-center">
                <p className="text-[var(--muted)]">Loading products...</p>
              </div>
            ) : loadError ? (
              <div className="rounded-3xl border py-24 text-center">
                <h2 className="text-2xl font-bold">Unable to load products</h2>
                <p className="mt-3 text-[var(--muted)]">Please check your connection and try again.</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-6 rounded-full bg-[var(--teal)] px-6 py-3 text-white"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <EmptyState />
            )}
          </div>
          </div>
        </div>


            </Container>
    </section>
  </>
  );
}
    