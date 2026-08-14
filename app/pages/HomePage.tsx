import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHomepageSettings } from "../lib/homepage";
import type { HomepageSettings } from "../types/homepage";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import SEO from "../components/common/SEO";
import heroLogo400 from "../assets/logos/logo-home-400.webp";
import heroLogo800 from "../assets/logos/logo-home-800.webp";

const FeaturedCollections = lazy(
  () => import("../components/homepage/FeaturedCollections")
);

const WhyChooseUs = lazy(
  () => import("../components/homepage/WhyChooseUs")
);

const BestSellers = lazy(
  () => import("../components/homepage/BestSellers")
);

const Testimonials = lazy(
  () => import("../components/homepage/Testimonials")
);

const Newsletter = lazy(
  () => import("../components/homepage/Newsletter")
);

const CategoryGrid = lazy(
  () => import("../components/homepage/CategoryGrid")
);

const NewArrivals = lazy(
  () => import("../components/homepage/NewArrivals")
);

export default function HomePage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<HomepageSettings | null>(null);

  useEffect(() => {
    async function loadHomepage() {
      const data = await getHomepageSettings();
      setSettings(data);
    }

    loadHomepage();
  }, []);

  const cmsHeroImage = settings?.hero_image_url?.trim();

  const heroImage400 = cmsHeroImage || heroLogo400;
  const heroImage800 = cmsHeroImage || heroLogo800;

  return (
    <>
      {/* Hero Section */}
      {settings?.hero_enabled !== false && (
        <section className="relative overflow-hidden bg-white">
          <Container>
            <div className="grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-20">
              <div className="order-1 flex justify-center lg:order-none lg:justify-start">
                <div className="relative">
                  <div className="absolute inset-10 rounded-full bg-[var(--teal)]/8 blur-3xl" />

                  <picture>
                    <source
                      media="(max-width: 639px)"
                      srcSet={heroImage400}
                    />

                    <img
                      src={heroImage800}
                      alt={settings?.hero_title || "Dress Like Nawaabs"}
                      width={800}
                      height={806}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="relative max-h-[560px] w-auto max-w-full object-contain"
                    />
                  </picture>
                </div>
              </div>

              <div className="order-2 max-w-2xl lg:order-none">
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--teal)]">
                  {settings?.hero_subtitle || "Luxury Indian Ethnic Wear"}
                </p>

                <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-6xl lg:text-7xl">
                  {settings?.hero_title || "Dress Like Nawaabs"}
                </h1>

                <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">
                  Timeless craftsmanship inspired by royal heritage. Discover handcrafted ethnic wear designed for weddings, celebrations and unforgettable occasions.
                </p>

                <div className="mt-10">
                  <Button
                    onClick={() => navigate(settings?.hero_button_url || "/shop")}
                  >
                    {settings?.hero_button_text || "Explore Collection"}
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Below-the-fold sections */}
      <Suspense fallback={null}>
        {settings?.featured_categories_enabled !== false && (
          <CategoryGrid settings={settings} />
        )}

        {settings?.new_arrivals_enabled !== false && (
          <NewArrivals settings={settings} />
        )}

        {settings?.featured_collections_enabled !== false && (
          <FeaturedCollections settings={settings} />
        )}

        {settings?.why_choose_us_enabled !== false && (
          <WhyChooseUs settings={settings} />
        )}

        {settings?.best_sellers_enabled !== false && (
          <BestSellers settings={settings} />
        )}

        {settings?.testimonials_enabled !== false && (
          <Testimonials settings={settings} />
        )}

        {settings?.newsletter_enabled !== false && (
          <Newsletter settings={settings} />
        )}
      </Suspense>

      <SEO
        title="Dress Like Nawaabs"
        description="Explore Dress Like Nawaabs, a curated catalogue of premium Indian ethnic wear. Browse Kurtis, Sarees, Shararas, Co-ord Sets and more, then enquire directly on WhatsApp."
      />
    </>
  );
}