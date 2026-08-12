import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHomepageSettings } from "../lib/homepage";
import type { HomepageSettings } from "../types/homepage";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import SEO from "../components/common/SEO";
import { supabase } from "../lib/supabase";
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

  const [settings, setSettings] =
    useState<HomepageSettings | null>(null);

  const [siteLogoUrl, setSiteLogoUrl] = useState("");

  useEffect(() => {
    async function loadHomepage() {
      const [homepageData, siteSettingsResult] =
        await Promise.all([
          getHomepageSettings(),

          supabase
            .from("site_settings")
            .select("logo_url")
            .eq("id", 1)
            .single(),
        ]);

      setSettings(homepageData);

      if (!siteSettingsResult.error) {
        setSiteLogoUrl(
          siteSettingsResult.data?.logo_url ?? ""
        );
      }
    }

    loadHomepage();
  }, []);

  const heroLogo = siteLogoUrl || heroLogo800;

  return (
    <>
      {/* Hero Section */}
      {settings?.hero_enabled !== false && (
        <section className="relative overflow-hidden bg-[var(--background)]">
          <Container>
            <div className="grid min-h-[680px] items-center gap-12 py-20 lg:grid-cols-2 lg:py-24">
              <div className="max-w-2xl">
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                  {settings?.hero_subtitle ||
                    "Luxury Indian Ethnic Wear"}
                </p>

                <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-6xl lg:text-7xl">
                  {settings?.hero_title ||
                    "Dress Like Nawaabs"}
                </h1>

                <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">
                  {settings?.hero_subtitle ||
                    "Timeless craftsmanship inspired by royal heritage. Discover handcrafted ethnic wear designed for weddings, celebrations and unforgettable occasions."}
                </p>

                <div className="mt-10">
                  <Button
                    onClick={() =>
                      navigate(
                        settings?.hero_button_url || "/shop"
                      )
                    }
                  >
                    {settings?.hero_button_text ||
                      "Explore Collection"}
                  </Button>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-6 rounded-full bg-[var(--accent)]/10 blur-3xl" />

                  <img
                    src={heroLogo}
                    alt="Dress Like Nawaabs"
                    width={800}
                    height={806}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="relative max-h-[520px] w-auto object-contain"
                  />
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