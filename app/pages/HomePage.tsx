import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHomepageSettings } from "../lib/homepage";
import type { HomepageSettings } from "../types/homepage";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import FeaturedCollections from "../components/homepage/FeaturedCollections";
import WhyChooseUs from "../components/homepage/WhyChooseUs";
import BestSellers from "../components/homepage/BestSellers";
import Testimonials from "../components/homepage/Testimonials";
import Newsletter from "../components/homepage/Newsletter";

import CategoryGrid from "../components/homepage/CategoryGrid";
import NewArrivals from "../components/homepage/NewArrivals";
import SEO from "../components/common/SEO";
import heroLogo from "../assets/logos/logo-home.png";


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

  return (
    <>
      {/* Hero Section */}
      {settings?.hero_enabled !== false && (
        <section className="relative overflow-hidden bg-[var(--background)]">
          <Container>
            <div className="grid min-h-[680px] items-center gap-12 py-20 lg:grid-cols-2 lg:py-24">
              <div className="max-w-2xl">
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                  {settings?.hero_subtitle || "Luxury Indian Ethnic Wear"}
                </p>

                <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-6xl lg:text-7xl">
                  {settings?.hero_title || "Dress Like Nawaabs"}
                </h1>

                <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">
                  {settings?.hero_subtitle ||
                    "Timeless craftsmanship inspired by royal heritage. Discover handcrafted ethnic wear designed for weddings, celebrations and unforgettable occasions."}
                </p>

                <div className="mt-10">
                  <Button
                    onClick={() =>
                      navigate(settings?.hero_button_url || "/shop")
                    }
                  >
                    {settings?.hero_button_text || "Explore Collection"}
                  </Button>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-6 rounded-full bg-[var(--accent)]/10 blur-3xl" />

                  <img
                    src={heroLogo}
                    alt="Dress Like Nawaabs"
                    className="relative w-full max-w-md rounded-full shadow-2xl"
                    loading="eager"
                    decoding="sync"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

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

      <SEO
        title="Dress Like Nawaabs"
        description="Discover handcrafted Indian ethnic wear inspired by royal heritage, designed for weddings, celebrations and unforgettable occasions."
      />
    </>
  );
}