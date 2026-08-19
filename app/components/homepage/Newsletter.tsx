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
    <section
      id="newsletter"
      className="scroll-mt-20 bg-[var(--surface)] py-8 sm:py-10 text-[var(--foreground)]"
    >
      <Container>

        <div className="mx-auto max-w-4xl rounded-3xl border border-black/10 bg-[var(--background)] px-6 py-10 text-center shadow-sm sm:px-12 sm:py-14"></div><div className="mx-auto max-w-3xl text-center">

          <p className="uppercase tracking-[0.35em]">
            Stay Updated
          </p>

          <h2 className="mt-5 text-2xl font-bold sm:text-4xl">
            {settings?.newsletter_title ??
              "Join the Dress Like Nawaabs Family"}
          </h2>

          <p className="mt-6 text-[1.05rem] leading-8 text-[var(--muted)]">
            {settings?.newsletter_subtitle ??
              "Be the first to know about new arrivals, exclusive collections, wedding style inspiration and special offers."}
          </p>

          <form className="mx-auto mt-10 flex max-w-xl flex-col gap-4 sm:flex-row">

            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-black/10 bg-white px-6 py-4 text-[var(--foreground)] outline-none transition focus:border-[var(--burgundy)] focus:ring-2 focus:ring-[var(--burgundy)]/10"
            />

            <Button
              type="submit"
              className="bg-[var(--burgundy)] !text-white hover:bg-[#641932]"
            >
              Subscribe
            </Button>

          </form>

        </div>

      </Container>
    </section>
  );
}