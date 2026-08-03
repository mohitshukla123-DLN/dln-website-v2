import Container from "../components/ui/Container";
import PageTitle from "../components/common/PageTitle";

export default function SizeGuidePage() {
  return (
    <>
    <PageTitle title="Size Guide" />
    <section className="py-20">
      <Container>
        <h1 className="text-5xl font-bold">
          Size Guide
        </h1>

        <p className="mt-4 text-[var(--muted)]">
          Use this guide to choose the best fit.
        </p>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full border border-black/10">
            <thead className="bg-black/5">
              <tr>
                <th className="border p-4">Size</th>
                <th className="border p-4">Bust (in)</th>
                <th className="border p-4">Waist (in)</th>
                <th className="border p-4">Hip (in)</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-4">S</td>
                <td className="border p-4">36</td>
                <td className="border p-4">32</td>
                <td className="border p-4">38</td>
              </tr>

              <tr>
                <td className="border p-4">M</td>
                <td className="border p-4">38</td>
                <td className="border p-4">34</td>
                <td className="border p-4">40</td>
              </tr>

              <tr>
                <td className="border p-4">L</td>
                <td className="border p-4">40</td>
                <td className="border p-4">36</td>
                <td className="border p-4">42</td>
              </tr>

              <tr>
                <td className="border p-4">XL</td>
                <td className="border p-4">42</td>
                <td className="border p-4">38</td>
                <td className="border p-4">44</td>
              </tr>

              <tr>
                <td className="border p-4">XXL</td>
                <td className="border p-4">44</td>
                <td className="border p-4">40</td>
                <td className="border p-4">46</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </section>
    </>
  );
}