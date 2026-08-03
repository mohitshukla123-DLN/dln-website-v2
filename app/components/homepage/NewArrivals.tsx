import { Link } from "react-router-dom";

import Button from "../ui/Button";
import Container from "../ui/Container";
import ProductGrid from "../shop/ProductGrid";

import { products } from "../../data/products";

export default function NewArrivals() {
  const newProducts = products
    .filter((product) => product.badge === "NEW")
    .slice(0, 3);

  if (newProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-24">
      <Container>
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--teal)]">
              Latest Collection
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              New Arrivals
            </h2>
          </div>

          <Link to="/new-arrivals">
            <Button>View All</Button>
          </Link>
        </div>

        <ProductGrid products={newProducts} />
      </Container>
    </section>
  );
}