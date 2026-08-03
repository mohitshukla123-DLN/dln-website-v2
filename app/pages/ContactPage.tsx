import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import PageTitle from "../components/common/PageTitle";

export default function ContactPage() {
  return (
    <>
    <PageTitle title="Contact" />
      {/* Hero */}

      <section className="bg-[var(--teal)] py-24 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 uppercase tracking-[0.3em]">
              Contact Dress Like Nawaabs
            </p>

            <h1 className="text-5xl font-bold lg:text-6xl">
              We'd Love To Hear From You
            </h1>

            <p className="mt-8 text-lg text-white/90">
              Whether you need help choosing a design, size, or wish to
              customize an outfit, our team is here to assist you.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Information */}

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">
                Contact Information
              </h2>

              <div className="mt-8 space-y-6">

                <div>
                  <h3 className="font-semibold">
                    📞 Phone
                  </h3>

                  <p className="text-[var(--muted)]">
                    +91 75708 28473
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">
                    💬 WhatsApp
                  </h3>

                  <p className="text-[var(--muted)]">
                    +91 75708 28473
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">
                    ✉️ Email
                  </h3>

                  <p className="text-[var(--muted)]">
                    dresslikenawaabs@gmail.com
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">
                    🕒 Business Hours
                  </h3>

                  <p className="text-[var(--muted)]">
                    Monday – Saturday
                    <br />
                    10:00 AM – 7:00 PM
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">
                    📍 Address
                  </h3>

                  <p className="text-[var(--muted)]">
                    Your Store Address
                    <br />
                    City, State
                    <br />
                    India
                  </p>
                </div>

              </div>
            </div>

            {/* Contact Form */}

            <div className="rounded-3xl border border-black/10 p-8 shadow-sm">

              <h2 className="text-3xl font-bold">
                Send an Enquiry
              </h2>

              <form className="mt-8 space-y-6">

                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full rounded-xl border p-4"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full rounded-xl border p-4"
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full rounded-xl border p-4"
                />

                <textarea
                  rows={5}
                  placeholder="Your Message"
                  className="w-full rounded-xl border p-4"
                />

                <Button className="w-full">
                  Send Message
                </Button>

              </form>

            </div>
          </div>
        </Container>
      </section>
    </>
  );
}