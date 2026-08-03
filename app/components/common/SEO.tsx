import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
}

const SITE_NAME = "Dress Like Nawaabs";
const SITE_URL = "https://dresslikenawaabs.pages.dev";
const DEFAULT_IMAGE = "/og-image.jpg";

export default function SEO({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
}: SEOProps) {
  const fullTitle =
    title === "Home"
      ? SITE_NAME
      : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta
        name="description"
        content={description}
      />

      {keywords && (
        <meta
          name="keywords"
          content={keywords}
        />
      )}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta
        property="og:image"
        content={`${SITE_URL}${image}`}
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        name="twitter:title"
        content={fullTitle}
      />
      <meta
        name="twitter:description"
        content={description}
      />
      <meta
        name="twitter:image"
        content={`${SITE_URL}${image}`}
      />
    </Helmet>
  );
}