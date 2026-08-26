import type { HomepageSettings } from "../../types/homepage";
import Container from "../ui/Container";

interface Props {
  settings: HomepageSettings | null;
}

const features = [
  {
    title: "Royal Craftsmanship",
    description:
      "Every outfit is designed with meticulous attention to detail, inspired by timeless Indian royalty.",
    icon: "👑",
  },
  {
    title: "Premium Fabrics",
    description:
      "We source luxurious fabrics that offer unmatched comfort, elegance and durability.",
    icon: "🧵",
  },
  {
    title: "Perfect Fit",
    description:
      "Custom tailoring and precise measurements ensure every garment feels made just for you.",
    icon: "📏",
  },
  {
    title: "Trusted Quality",
    description:
      "Thousands of customers trust Dress Like Nawaabs for weddings and celebrations.",
    icon: "⭐",
  },
];

export default function WhyChooseUs({ settings }: Props) {

  if (settings?.why_choose_us_enabled === false) {
    return null;
  }

  return (
    <section id="why-choose-us" className="scroll-mt-20 bg-[var(--surface)] py-5 sm:py-8">
      <Container>

        <div className="mb-4 text-center sm:mb-8">

          <p className="text-xs uppercase tracking-[0.25em] text-[var(--burgundy)] sm:text-sm">
            Why Choose Us
          </p>

          <h2 className="mt-2 font-serif text-lg font-bold leading-tight tracking-normal sm:mt-4 sm:text-4xl">
            {settings?.why_choose_us_title ??
              "Crafted for Modern Royalty"}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:mt-5 sm:text-base">
            {settings?.why_choose_us_subtitle ??
              "We blend heritage craftsmanship with contemporary design to create clothing that makes every celebration unforgettable."}
          </p>

        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl bg-white p-4 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5"
            >
              <div className="text-5xl">
                {feature.icon}
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm text-[var(--muted)]">
                {feature.description}
              </p>

            </article>
          ))}
        </div>

      </Container>
    </section>
  );
}