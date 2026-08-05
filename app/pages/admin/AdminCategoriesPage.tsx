import Container from "../../components/ui/Container";

export default function AdminCategoriesPage() {
  return (
    <Container>
      <section className="py-16">
        <h1 className="text-4xl font-bold">
          Categories
        </h1>

        <p className="mt-3 text-[var(--muted)]">
          Manage product categories.
        </p>
      </section>
    </Container>
  );
}