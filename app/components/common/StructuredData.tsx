import { Helmet } from "react-helmet-async";

const SITE_URL = "https://dresslikenawaabs.pages.dev";

export default function StructuredData() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Dress Like Nawaabs",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.png`,
      description:
        "Premium Indian ethnic wear including Kurtis, Sarees, Shararas, Co-ord Sets and more.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Dress Like Nawaabs",
      url: SITE_URL,
      description:
        "Premium Indian ethnic wear catalogue for discovering collections and making WhatsApp enquiries.",
    },
  ];

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}