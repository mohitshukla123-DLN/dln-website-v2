import Container from "../../components/ui/Container";

export default function AdminHomepagePage() {
  return (
    <Container>
      <section className="py-16">
        <h1 className="text-4xl font-bold">
          Homepage CMS
        </h1>

        <p className="mt-3 text-[var(--muted)]">
          Manage homepage sections.
        </p>
      </section>
    </Container>
  );
}