import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  canonical?: string;
}

const SITE_NAME = "Dress Like Nawaabs";
const SITE_URL = "https://dresslikenawaabs.pages.dev";
const DEFAULT_IMAGE = "/og-image.jpg";

function absoluteUrl(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

export default function SEO({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  canonical,
}: SEOProps) {
  const fullTitle =
    title === "Home" || title === SITE_NAME
      ? SITE_NAME
      : `${title} | ${SITE_NAME}`;

  const canonicalUrl = canonical || SITE_URL;
  const imageUrl = absoluteUrl(image);

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

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      <meta
        name="robots"
        content="index,follow"
      />

      <meta
        name="theme-color"
        content="#111111"
      />

      <meta
        property="og:site_name"
        content={SITE_NAME}
      />

      <meta
        property="og:title"
        content={fullTitle}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:image"
        content={imageUrl}
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
        content={imageUrl}
      />
    </Helmet>
  );
}