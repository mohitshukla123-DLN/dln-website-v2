import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";

import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import SEO from "../components/common/SEO";
import { supabase } from "../lib/supabase";

export default function ContactPage() {
  const [siteSettings, setSiteSettings] = useState({
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    google_maps: "",
  });

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("site_settings")
        .select("phone,whatsapp,email,address,google_maps")
        .limit(1)
        .single();

      if (data) {
        setSiteSettings({
          phone: data.phone ?? "",
          whatsapp: data.whatsapp ?? "",
          email: data.email ?? "",
          address: data.address ?? "",
          google_maps: data.google_maps ?? "",
        });
      }
    }

    loadSettings();
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      await emailjs.send(
        "service_2wg6n31",
        "template_rcz7uct",
        {
          title: "Website Enquiry",
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        },
        "Xof8CYOdMm4b949az"
      );

      setStatus("Message sent successfully.");

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch {
      setStatus("Unable to send message. Please try again.");
    }

    setLoading(false);
  }

  return (
    <>
      <SEO
        title="Contact"
        description="Contact Dress Like Nawaabs for enquiries, WhatsApp assistance, custom orders and customer support."
        canonical="https://dresslikenawaabs.pages.dev/contact"
      />

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
              Whether you need help choosing a design, size, or wish to customize
              an outfit, our team is here to assist you.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact & Enquiry Side-by-Side */}
      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            {/* Left Column: Contact Information */}
            <div>
              <h2 className="text-3xl font-bold">Contact Information</h2>
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="font-semibold">📞 Phone</h3>
                  <a
                    href={`tel:${siteSettings.phone.replace(/\D/g, "")}`}
                    className="font-medium text-[var(--teal)] underline underline-offset-4 transition hover:opacity-80"
                  >
                    {siteSettings.phone}
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold">💬 WhatsApp</h3>
                  <a
                    href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--teal)] underline underline-offset-4 transition hover:opacity-80"
                  >
                    {siteSettings.whatsapp}
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold">✉️ Email</h3>
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="font-medium text-[var(--teal)] underline underline-offset-4 transition hover:opacity-80"
                  >
                    {siteSettings.email}
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold">🕒 Business Hours</h3>
                  <p className="text-[var(--muted)]">
                    Monday – Saturday
                    <br />
                    10:00 AM – 7:00 PM
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">📍 Address</h3>
                  {siteSettings.google_maps ? (
                    <a
                      href={siteSettings.google_maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--muted)] underline underline-offset-4"
                    >
                      {siteSettings.address}
                    </a>
                  ) : (
                    <p className="text-[var(--muted)]">{siteSettings.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Send an Enquiry Form */}
            <div className="rounded-3xl border border-black/10 p-8 shadow-sm">
              <h2 className="text-3xl font-bold">Send an Enquiry</h2>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full rounded-xl border p-4"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full rounded-xl border p-4"
                />

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full rounded-xl border p-4"
                />

                <textarea
                  rows={5}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  className="w-full rounded-xl border p-4"
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending..." : "Send Message"}
                </Button>

                {status && (
                  <p className="text-center text-sm text-[var(--teal)]">
                    {status}
                  </p>
                )}
              </form>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}