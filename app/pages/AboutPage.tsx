import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import SEO from "../components/common/SEO";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <>
    <SEO
      title="About Us"
      description="Learn about Dress Like Nawaabs, our vision, craftsmanship, premium fabrics and commitment to luxury ethnic wear."
      canonical="https://dresslikenawaabs.pages.dev/about"
    />

      {/* Hero */}

      <section className="bg-[var(--teal)] py-24 text-white">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 uppercase tracking-[0.3em]">
              Dress Like Nawaabs
            </p>

            <h1 className="text-5xl font-bold lg:text-6xl">
              Where Royal Heritage
              <br />
              Meets Modern Elegance
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg text-white/90">
              We celebrate the timeless beauty of Indian ethnic wear through
              carefully curated collections inspired by craftsmanship,
              tradition and luxury.
            </p>
          </div>
        </Container>
      </section>

      {/* Our Story */}

      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold">
              Our Story
            </h2>

            <p className="mt-8 leading-8 text-[var(--muted)]">
              Dress Like Nawaabs was created with a vision to bring together
              India's rich textile heritage and contemporary fashion.
              Every outfit reflects elegance, sophistication and attention
              to detail, making every celebration truly memorable.
            </p>

            <p className="mt-6 leading-8 text-[var(--muted)]">
              From handcrafted embroidery to premium fabrics, we work
              towards offering timeless pieces that remain beautiful for
              years to come.
            </p>
          </div>
        </Container>
      </section>

      {/* Values */}

      <section className="bg-black/5 py-24">
        <Container>
          <h2 className="mb-14 text-center text-4xl font-bold">
            Why Choose Dress Like Nawaabs
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold">
                Premium Fabrics
              </h3>

              <p className="mt-4 text-[var(--muted)]">
                Carefully selected fabrics offering luxury, comfort and
                durability.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold">
                Handcrafted Work
              </h3>

              <p className="mt-4 text-[var(--muted)]">
                Skilled artisans create intricate embroidery inspired by
                traditional craftsmanship.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold">
                Elegant Designs
              </h3>

              <p className="mt-4 text-[var(--muted)]">
                Modern silhouettes blended with timeless Indian aesthetics.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold">
                Customer First
              </h3>

              <p className="mt-4 text-[var(--muted)]">
                We strive to deliver a delightful shopping experience with
                personalized assistance.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Promise */}

      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold">
              Our Promise
            </h2>

            <p className="mt-8 leading-8 text-[var(--muted)]">
              Every Dress Like Nawaabs creation is crafted with passion,
              precision and respect for Indian artistry. Our goal is to
              ensure every customer feels confident, elegant and celebrated.
            </p>

            <div className="mt-12">
              <Button onClick={() => navigate("/shop")}>
                Explore Our Collection
              </Button>
            </div>
          </div>
</Container>
    </section>
  </>
  );
}