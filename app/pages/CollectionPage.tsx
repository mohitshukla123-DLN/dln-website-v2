import { useParams } from "react-router-dom";

import Container from "../components/ui/Container";
import ProductGrid from "../components/shop/ProductGrid";

import { products } from "../data/products";
import { collections } from "../data/collections";
import PageTitle from "../components/common/PageTitle";

export default function CollectionPage() {
  const { slug } = useParams();

  const collection = collections.find(
    (item) => item.slug === slug
  );

  if (!collection) {
    return (
      <>
      <PageTitle title="Collections" />
      <Container>
        <section className="py-20">
          <h1 className="text-4xl font-bold">
            Collection not found
          </h1>
        </section>
      </Container>
      </>
    );
  }

  const filteredProducts = products.filter(
    (product) =>
      collection.badge &&
      product.badge === collection.badge
  );

  return (
    <>
      <PageTitle title="Collections" />
    <section className="py-20">
      <Container>
        <h1 className="text-5xl font-bold">
          {collection.title}
        </h1>

        <p className="mt-4 mb-10 text-[var(--muted)]">
          {collection.description}
        </p>

        <ProductGrid products={filteredProducts} />
      </Container>
    </section>
    </>
  );
}