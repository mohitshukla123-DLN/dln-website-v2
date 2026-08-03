import { Helmet } from "react-helmet-async";

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dress Like Nawaabs",
    url: "https://dresslikenawaabs.pages.dev",
    logo: "https://dresslikenawaabs.pages.dev/favicon.png",
    description:
      "Premium ethnic wear including Kurtis, Sarees, Shararas, Co-ord Sets and more.",
    sameAs: [],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}