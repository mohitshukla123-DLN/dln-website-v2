import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import FeaturedCollections from "../components/homepage/FeaturedCollections";

import logo from "../assets/logos/logo-home.png";

import WhyChooseUs from "../components/homepage/WhyChooseUs";
import BestSellers from "../components/homepage/BestSellers";
import Testimonials from "../components/homepage/Testimonials";
import Newsletter from "../components/homepage/Newsletter";

import CategoryGrid from "../components/homepage/CategoryGrid";
import NewArrivals from "../components/homepage/NewArrivals";
import SEO from "../components/common/SEO";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Home"
        description="Dress Like Nawaabs offers handcrafted luxury ethnic wear inspired by royal heritage. Discover premium kurtis, sarees, jackets and festive collections."
        canonical="https://dresslikenawaabs.pages.dev/"
        keywords="Lucknow Chikankari, Luxury Kurti, Ethnic Wear, Designer Sarees, Women's Fashion, Dress Like Nawaabs"
      />
      {/* Hero Section */}
      <section className="py-24">
        <Container>
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-4 uppercase tracking-[0.3em] text-[var(--teal)]">
                Luxury Indian Ethnic Wear
              </p>

              <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
                Dress Like
                <br />
                Nawaabs
              </h1>

              <p className="mt-8 max-w-xl text-lg text-[var(--muted)]">
                Timeless craftsmanship inspired by royal heritage.
                Discover handcrafted ethnic wear designed for weddings,
                celebrations and unforgettable occasions.
              </p>

              <div className="mt-10">
                <Button onClick={() => navigate("/shop")}>
                  Explore Collection
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <img
              src={logo}
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

      <CategoryGrid />

    <NewArrivals />

    {/* Featured Collections */}
    <FeaturedCollections />

<WhyChooseUs />
<BestSellers />
<Testimonials />
<Newsletter />
    </>
  );
}