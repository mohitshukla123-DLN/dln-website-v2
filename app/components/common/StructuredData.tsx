import { Helmet } from "react-helmet-async";

const SITE_URL = "https://dresslikenawaabs.pages.dev";

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dress Like Nawaabs",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description:
      "Premium Indian ethnic wear including Kurtis, Sarees, Shararas, Co-ord Sets and more.",
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}