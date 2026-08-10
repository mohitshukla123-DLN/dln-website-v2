import type { HomepageSettings } from "../../types/homepage";
import Button from "../ui/Button";
import Container from "../ui/Container";

interface Props {
  settings: HomepageSettings | null;
}

export default function Newsletter({ settings }: Props) {

  if (settings?.newsletter_enabled === false) {
    return null;
  }

  return (
    <section className="bg-[var(--teal)] py-24 text-white">
      <Container>

        <div className="mx-auto max-w-3xl text-center">

          <p className="uppercase tracking-[0.35em]">
            Stay Updated
          </p>

          <h2 className="mt-5 text-4xl font-bold">
            {settings?.newsletter_title ??
              "Join the Dress Like Nawaabs Family"}
          </h2>

          <p className="mt-6 text-white/80">
            {settings?.newsletter_subtitle ??
              "Be the first to know about new arrivals, exclusive collections, wedding style inspiration and special offers."}
          </p>

          <form className="mx-auto mt-10 flex max-w-xl flex-col gap-4 sm:flex-row">

            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full px-6 py-4 text-black outline-none"
            />

            <Button
              type="submit"
              className="bg-white !text-[var(--teal)] hover:bg-neutral-100"
            >
              Subscribe
            </Button>

          </form>

        </div>

      </Container>
    </section>
  );
}