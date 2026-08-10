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
        <section className="py-16">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--teal)]">
                  {settings?.hero_subtitle ||
                    "Luxury Indian Ethnic Wear"}
                </p>

                <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
                  {settings?.hero_title || "Dress Like Nawaabs"}
                </h1>

                <p className="mt-8 max-w-xl text-lg text-[var(--muted)]">
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

              <div className="flex justify-center">
                <img
                  src={heroLogo}
                  alt="Dress Like Nawaabs"
                  className="w-full max-w-md rounded-full shadow-2xl"
                  loading="eager"
                  decoding="sync"
                  style={{
                    imageRendering: "auto",
                    transform: "translateZ(0)",
                  }}
                />
              </div>
            </div>
          </Container>
        </section>
      )}

      <CategoryGrid settings={settings} />

      <NewArrivals settings={settings} />

      {/* Featured Collections */}
      <FeaturedCollections settings={settings} />

      <WhyChooseUs settings={settings} />

      <BestSellers settings={settings} />

      <Testimonials settings={settings} />

      <Newsletter settings={settings} />

      <SEO
        title="Dress Like Nawaabs"
        description="Discover handcrafted Indian ethnic wear inspired by royal heritage, designed for weddings, celebrations and unforgettable occasions."
      />
    </>
  );
}