import Container from "../components/ui/Container";

const sizes = [
  ["32", "32", "28", "34"],
  ["34", "34", "30", "36"],
  ["36", "36", "32", "38"],
  ["38", "38", "34", "40"],
  ["40", "40", "36", "42"],
  ["42", "42", "38", "44"],
  ["44", "44", "40", "46"],
  ["46", "46", "42", "48"],
  ["Free Size", "Adjustable", "Adjustable", "Adjustable"],
];

export default function SizeGuidePage() {
  return (
    <section className="bg-[var(--background)] py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--burgundy)]">
              Fit & Measurement
            </p>

            <h1 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Size Guide
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
              Measure around your body where indicated and compare your
              measurements with the chart below. All measurements are in
              inches.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm sm:mt-10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--burgundy)] text-white">
                    <th className="px-4 py-4 text-left font-semibold">
                      Size
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Bust (inches)
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Waist (inches)
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Hip (inches)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sizes.map(([size, bust, waist, hip], index) => (
                    <tr
                      key={size}
                      className={
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-[var(--surface)]"
                      }
                    >
                      <td className="border-t border-black/10 px-4 py-4 font-semibold">
                        {size}
                      </td>
                      <td className="border-t border-black/10 px-4 py-4 text-center">
                        {bust}
                      </td>
                      <td className="border-t border-black/10 px-4 py-4 text-center">
                        {waist}
                      </td>
                      <td className="border-t border-black/10 px-4 py-4 text-center">
                        {hip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
            <h2 className="font-serif text-xl font-bold">
              How to measure
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
              <p>
                <strong className="text-[var(--foreground)]">Bust:</strong>{" "}
                Measure around the fullest part of your chest.
              </p>

              <p>
                <strong className="text-[var(--foreground)]">Waist:</strong>{" "}
                Measure around the narrowest part of your waist.
              </p>

              <p>
                <strong className="text-[var(--foreground)]">Hip:</strong>{" "}
                Measure around the fullest part of your hips.
              </p>

              <p>
                Keep the measuring tape level and comfortably snug. Do not
                pull the tape tightly.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}