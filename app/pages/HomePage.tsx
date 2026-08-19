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
            <div className="grid min-h-[680px] w-full items-center justify-items-center gap-8 py-10 sm:gap-10 sm:py-12 lg:min-h-[720px] lg:grid-cols-2 lg:justify-items-stretch lg:gap-16 lg:py-20">
              <div className="order-1 flex w-full justify-center lg:order-none lg:justify-start">
                <div className="relative">
                  <div className="absolute inset-10 rounded-full bg-[var(--burgundy)]/8 blur-3xl" />

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
                      className="relative max-h-[680px] w-auto max-w-full object-contain max-sm:max-h-[460px] lg:max-h-[700px]"
                    />
                  </picture>
                </div>
              </div>

              <div className="order-2 flex w-full max-w-2xl flex-col items-center justify-center text-center lg:order-none lg:items-start lg:min-h-[560px] lg:justify-center lg:text-left">
                <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-[var(--burgundy)] sm:mb-6">
                  {settings?.hero_subtitle || "Luxury Indian Ethnic Wear"}
                </p>

                <h1 className="hero-title mx-auto w-full max-w-none whitespace-nowrap text-[clamp(2.7rem,11vw,6.8rem)] text-[var(--foreground)] lg:mx-0 lg:text-[clamp(4.25rem,6.4vw,7rem)]">
                  {settings?.hero_title || "Dress Like Nawaabs"}
                </h1>

                <p className="mx-auto mt-2 max-w-xl text-base leading-7 text-[var(--muted)] sm:mt-3 sm:text-lg sm:leading-8 lg:mx-0 lg:mt-3 lg:text-xl lg:leading-9">
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