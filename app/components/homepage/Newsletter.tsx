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
  className="scroll-mt-20 bg-[var(--background)] py-10 text-[var(--foreground)] sm:py-14 lg:py-16"
>
  <Container>
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--burgundy)] sm:text-sm">
        Stay Updated
      </p>

      <h2 className="mt-4 font-serif text-3xl font-normal leading-tight tracking-wide sm:mt-5 sm:text-5xl">
        {settings?.newsletter_title ??
          "Join the Dress Like Nawaabs Family"}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:mt-6 sm:text-base sm:leading-8">
        {settings?.newsletter_subtitle ??
          "Be the first to know about new arrivals, exclusive collections, wedding style inspiration and special offers."}
      </p>

      <form className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:mt-8 sm:flex-row">
        <input
          type="email"
          placeholder="Enter your email"
          className="min-h-12 flex-1 rounded-full border border-black/10 bg-white px-5 text-sm text-black placeholder:text-black/40 outline-none transition focus:border-[var(--burgundy)] focus:ring-2 focus:ring-[var(--burgundy)]/10 sm:px-6"
        />

        <Button
          type="submit"
          className="min-h-12 bg-[var(--burgundy)] !text-white hover:bg-[#641932]"
        >
          Subscribe
        </Button>
      </form>
    </div>
  </Container>
</section>
  );
}