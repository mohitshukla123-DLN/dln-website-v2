import { useEffect, useState } from "react";
import Container from "../components/ui/Container";
import { getPolicySections } from "../lib/policies";
import type { PolicySection } from "../lib/policies";

export default function PolicyPage() {
  const [sections, setSections] = useState<PolicySection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPolicySections()
      .then(setSections)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
          {loading ? (
            <p className="py-8 text-center text-[var(--muted)]">
              Loading policies...
            </p>
          ) : sections.length === 0 ? (
            <p className="py-8 text-center text-[var(--muted)]">
              No policies are currently available.
            </p>
          ) : (
            <div className="space-y-8">
              {sections.map((section) => (
                <section key={section.id}>
                  <h2 className="text-xl font-semibold sm:text-2xl">
                    {section.title}
                  </h2>

                  <div className="mt-3 whitespace-pre-line leading-7 text-[var(--muted)]">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
