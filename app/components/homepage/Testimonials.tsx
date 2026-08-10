import type { HomepageSettings } from "../../types/homepage";
import Container from "../ui/Container";

interface Props {
  settings: HomepageSettings | null;
}

const testimonials = [
  {
    name: "Rahul Mehta",
    city: "Mumbai",
    review:
      "The sherwani exceeded my expectations. The craftsmanship and fit were absolutely perfect.",
  },
  {
    name: "Arjun Sharma",
    city: "Delhi",
    review:
      "Elegant designs, premium fabrics and outstanding service. Highly recommended for wedding wear.",
  },
  {
    name: "Karan Patel",
    city: "Ahmedabad",
    review:
      "Everyone complimented my outfit. Dress Like Nawaabs made my wedding truly memorable.",
  },
];

export default function Testimonials({ settings }: Props) {

  if (settings?.testimonials_enabled === false) {
    return null;
  }

  return (
    <section className="bg-[var(--background)] py-24">
      <Container>

        <div className="mb-14 text-center">

          <p className="text-sm uppercase tracking-[0.35em] text-[var(--teal)]">
            Testimonials
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            {settings?.testimonials_title ??
              "Loved by Our Customers"}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[var(--muted)]">
            {settings?.testimonials_subtitle ??
              "Hear what our customers have to say about their Dress Like Nawaabs experience."}
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-3">

          {testimonials.map((item) => (

            <article
              key={item.name}
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="mb-5 text-3xl">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="italic text-[var(--muted)]">
                "{item.review}"
              </p>

              <h3 className="mt-8 text-xl font-semibold">
                {item.name}
              </h3>

              <p className="text-sm text-[var(--muted)]">
                {item.city}
              </p>

            </article>

          ))}

        </div>

      </Container>
    </section>
  );
}