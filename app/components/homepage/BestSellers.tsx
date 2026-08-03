import Container from "../ui/Container";
import { products } from "../../data/products";
import ProductCard from "../product/ProductCard";

export default function BestSellers() {
  const bestSellers = products.filter((product) => product.bestseller);

  return (
    <section className="bg-white py-24">
      <Container>
        <div className="mb-14 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--teal)]">
            Best Sellers
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Our Most Loved Outfits
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[var(--muted)]">
            Discover the designs our customers choose for weddings,
            receptions and special celebrations.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}