import Container from "../components/ui/Container";

export default function PolicyPage() {
  return (
    <>
    <section className="py-20">
      <Container className="max-w-5xl">
        <h1 className="text-5xl font-bold">
          Policies
        </h1>

        <p className="mt-4 text-[var(--muted)]">
          Please read our policies before placing an enquiry or purchasing a product.
        </p>

        {/* Privacy Policy */}
        <section className="mt-14">
          <h2 className="text-3xl font-semibold">
            Privacy Policy
          </h2>

          <p className="mt-4 leading-8 text-[var(--muted)]">
            We respect your privacy. Any personal information shared with
            Dress Like Nawaabs is used only to process enquiries, communicate
            with you, and improve our services. We never sell or share your
            personal information with third parties except where required by law.
          </p>
        </section>

        {/* Shipping */}
        <section className="mt-14">
          <h2 className="text-3xl font-semibold">
            Shipping Policy
          </h2>

          <p className="mt-4 leading-8 text-[var(--muted)]">
            Shipping timelines vary depending on product availability and
            customization requirements. Customers will be informed of the
            estimated delivery time during order confirmation.
          </p>
        </section>

        {/* Returns */}
        <section className="mt-14">
          <h2 className="text-3xl font-semibold">
            Returns & Refunds
          </h2>

          <p className="mt-4 leading-8 text-[var(--muted)]">
            Due to the handcrafted and customized nature of our products,
            returns and refunds are accepted only for damaged or incorrect
            items reported within 48 hours of delivery.
          </p>
        </section>

        {/* Terms */}
        <section className="mt-14">
          <h2 className="text-3xl font-semibold">
            Terms & Conditions
          </h2>

          <p className="mt-4 leading-8 text-[var(--muted)]">
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