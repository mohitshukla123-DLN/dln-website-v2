import Container from "../components/ui/Container";

export default function PolicyPage() {
  return (
    <>
      <section className="bg-[var(--burgundy)] py-8 text-white sm:py-10">
        <Container className="max-w-5xl text-center">
          <h1 className="font-serif text-3xl font-bold sm:text-5xl">
            Policies
          </h1>
          <p className="mt-2 text-white/80 sm:mt-3">
            Please read our policies before placing an enquiry or purchasing a product.
          </p>
        </Container>
      </section>

      <section className="bg-white py-8 sm:py-10">
        <Container className="max-w-5xl">

          <section>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Privacy Policy
            </h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">
              We respect your privacy. Any personal information shared with
              Dress Like Nawaabs is used only to process enquiries, communicate
              with you, and improve our services. We never sell or share your
              personal information with third parties except where required by law.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Shipping Policy
            </h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">
              Shipping timelines vary depending on product availability and
              customization requirements. Customers will be informed of the
              estimated delivery time during order confirmation.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Returns & Refunds
            </h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">
              Due to the handcrafted and customized nature of our products,
              returns and refunds are accepted only for damaged or incorrect
              items reported within 48 hours of delivery.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Terms & Conditions
            </h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">
              By using this website, you agree to provide accurate information
              for enquiries and purchases. Dress Like Nawaabs reserves the
              right to update product information, pricing, and policies
              without prior notice.
            </p>
          </section>

        </Container>
      </section>
    </>
  );
}
