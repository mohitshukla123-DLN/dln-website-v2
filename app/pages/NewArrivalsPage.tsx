import Container from "../components/ui/Container";
import ProductGrid from "../components/shop/ProductGrid";
import { products } from "../data/products";
import PageTitle from "../components/common/PageTitle";
import SEO from "../components/common/SEO";

export default function NewArrivalsPage() {
  const newProducts = products.filter(
    (product) => product.badge === "NEW"
  );

  return (
    <>
    <SEO
      title="New Arrivals"
      description="Explore the latest premium ethnic wear including Kurtis, Sarees, Shararas and more at Dress Like Nawaabs."
      canonical="https://dresslikenawaabs.pages.dev/new-arrivals"
    />

    <PageTitle title="New Arrivals" />
    <section className="py-20">
      <Container>
        <h1 className="text-5xl font-bold">
          New Arrivals
        </h1>

        <p className="mt-4 mb-10 text-[var(--muted)]">
          Discover the latest additions to our collection.
        </p>

        <ProductGrid products={newProducts} />
      </Container>
    </section>
    </>
  );
}