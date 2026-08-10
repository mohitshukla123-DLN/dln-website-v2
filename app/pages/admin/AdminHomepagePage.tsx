import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import { supabase } from "../../lib/supabase";
import { getHomepageSettings } from "../../lib/homepage";

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState(false);

  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroButtonText, setHeroButtonText] = useState("");
  const [heroButtonUrl, setHeroButtonUrl] = useState("");
  const [heroEnabled, setHeroEnabled] = useState(true);
  const [featuredCategoriesTitle, setFeaturedCategoriesTitle] = useState("");
  const [featuredCategoriesSubtitle, setFeaturedCategoriesSubtitle] = useState("");
  const [featuredCategoriesEnabled, setFeaturedCategoriesEnabled] = useState(true);
  const [newArrivalsTitle, setNewArrivalsTitle] = useState("");
  const [newArrivalsSubtitle, setNewArrivalsSubtitle] = useState("");
  const [newArrivalsCount, setNewArrivalsCount] = useState(8);
  const [newArrivalsEnabled, setNewArrivalsEnabled] = useState(true);
  const [featuredCollectionsTitle, setFeaturedCollectionsTitle] = useState("");
  const [featuredCollectionsSubtitle, setFeaturedCollectionsSubtitle] = useState("");
  const [featuredCollectionsEnabled, setFeaturedCollectionsEnabled] = useState(true);
  const [whyChooseTitle, setWhyChooseTitle] = useState("");
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState("");
  const [whyChooseEnabled, setWhyChooseEnabled] = useState(true);
  const [bestSellersTitle, setBestSellersTitle] = useState("");
  const [bestSellersSubtitle, setBestSellersSubtitle] = useState("");
  const [bestSellersCount, setBestSellersCount] = useState(4);
  const [bestSellersEnabled, setBestSellersEnabled] = useState(true);
  const [testimonialsTitle, setTestimonialsTitle] = useState("");
  const [testimonialsSubtitle, setTestimonialsSubtitle] = useState("");
  const [testimonialsEnabled, setTestimonialsEnabled] = useState(true);
  const [newsletterTitle, setNewsletterTitle] = useState("");
  const [newsletterSubtitle, setNewsletterSubtitle] = useState("");
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);
  const [featuredCollectionsCount, setFeaturedCollectionsCount] = useState(6);
  

  async function loadSettings() {
    const data = await getHomepageSettings();

    if (!data) return;

      setHeroEnabled(data.hero_enabled ?? true);
      setNewArrivalsTitle(data.new_arrivals_title ?? "");
      setNewArrivalsSubtitle(data.new_arrivals_subtitle ?? "");
      setNewArrivalsCount(data.new_arrivals_count ?? 8);
      setNewArrivalsEnabled(data.new_arrivals_enabled ?? true);
      setFeaturedCollectionsTitle(data.featured_collections_title ?? "");
      setFeaturedCollectionsSubtitle(data.featured_collections_subtitle ?? "");
      setFeaturedCollectionsCount(data.featured_collections_count ?? 6);
      setFeaturedCollectionsEnabled(data.featured_collections_enabled ?? true);
      setBestSellersTitle(data.best_sellers_title ?? "");
      setBestSellersSubtitle(data.best_sellers_subtitle ?? "");
      setBestSellersCount(data.best_sellers_count ?? 4);
      setBestSellersEnabled(data.best_sellers_enabled ?? true);
      setTestimonialsTitle(data.testimonials_title ?? "");
      setTestimonialsSubtitle(data.testimonials_subtitle ?? "");
      setTestimonialsEnabled(data.testimonials_enabled ?? true);
      setNewsletterTitle(data.newsletter_title ?? "");
      setNewsletterSubtitle(data.newsletter_subtitle ?? "");
      setNewsletterEnabled(data.newsletter_enabled ?? true);
          

    if (!data) return;

    setHeroTitle(data.hero_title ?? "");
    setHeroSubtitle(data.hero_subtitle ?? "");
    setHeroButtonText(data.hero_button_text ?? "");
    setHeroButtonUrl(data.hero_button_url ?? "");
    setFeaturedCategoriesTitle(data.featured_categories_title ?? "");
    setFeaturedCategoriesSubtitle(data.featured_categories_subtitle ?? "");
    setFeaturedCategoriesEnabled(data.featured_categories_enabled ?? true);
    setWhyChooseTitle(data.why_choose_us_title ?? "");
    setWhyChooseSubtitle(data.why_choose_us_subtitle ?? "");
    setWhyChooseEnabled(data.why_choose_us_enabled ?? true);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function saveSettings() {
    setLoading(true);

    const { error } = await supabase
      .from("homepage_settings")
      .update({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_button_text: heroButtonText,
        hero_button_url: heroButtonUrl,
        hero_enabled: heroEnabled,
        featured_categories_title: featuredCategoriesTitle,
        featured_categories_subtitle: featuredCategoriesSubtitle,
        featured_categories_enabled: featuredCategoriesEnabled,
        new_arrivals_title: newArrivalsTitle,
        new_arrivals_subtitle: newArrivalsSubtitle,
        new_arrivals_count: newArrivalsCount,
        new_arrivals_enabled: newArrivalsEnabled,
        featured_collections_title: featuredCollectionsTitle,
        featured_collections_subtitle: featuredCollectionsSubtitle,
        featured_collections_count: featuredCollectionsCount,
        featured_collections_enabled: featuredCollectionsEnabled,
        why_choose_us_title: whyChooseTitle,
        why_choose_us_subtitle: whyChooseSubtitle,
        why_choose_us_enabled: whyChooseEnabled,
        best_sellers_title: bestSellersTitle,
        best_sellers_subtitle: bestSellersSubtitle,
        best_sellers_count: bestSellersCount,
        best_sellers_enabled: bestSellersEnabled,
        testimonials_title: testimonialsTitle,
        testimonials_subtitle: testimonialsSubtitle,
        testimonials_enabled: testimonialsEnabled,
        newsletter_title: newsletterTitle,
        newsletter_subtitle: newsletterSubtitle,
        newsletter_enabled: newsletterEnabled,
      })
      .eq("id", 1);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Homepage updated.");
  }

  return (
    <Container>
      <section className="py-16 max-w-5xl">

        <h1 className="text-4xl font-bold">
          Homepage CMS
        </h1>

        <p className="mt-2 text-[var(--muted)]">
          Manage homepage content.
        </p>

        <div className="mt-10 rounded-2xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Hero Section
          </h2>

          <div className="mt-10 rounded-2xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            Featured Categories
          </h2>

          <div className="mt-10 rounded-2xl border bg-white p-8">

            <h2 className="text-2xl font-semibold">
              New Arrivals
            </h2>

            <div className="mt-10 rounded-2xl border bg-white p-8">

            <h2 className="text-2xl font-semibold">
              Featured Collections
            </h2>

            <div className="mt-10 rounded-2xl border bg-white p-8">

              <h2 className="text-2xl font-semibold">
                Why Choose Us
              </h2>

              <div className="mt-6 space-y-4">

                <input
                  className="w-full rounded-lg border p-3"
                  placeholder="Section Title"
                  value={whyChooseTitle}
                  onChange={(e) => setWhyChooseTitle(e.target.value)}
                />

                <textarea
                  rows={3}
                  className="w-full rounded-lg border p-3"
                  placeholder="Subtitle"
                  value={whyChooseSubtitle}
                  onChange={(e) => setWhyChooseSubtitle(e.target.value)}
                />

                <label className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={whyChooseEnabled}
                    onChange={(e) => setWhyChooseEnabled(e.target.checked)}
                  />

                  Enable Why Choose Us

                </label>

              </div>

            </div>

            <div className="mt-10 rounded-2xl border bg-white p-8">

              <h2 className="text-2xl font-semibold">
                Best Sellers
              </h2>

              <div className="mt-6 space-y-4">

                <input
                  className="w-full rounded-lg border p-3"
                  placeholder="Section Title"
                  value={bestSellersTitle}
                  onChange={(e)=>setBestSellersTitle(e.target.value)}
                />

                <textarea
                  rows={3}
                  className="w-full rounded-lg border p-3"
                  placeholder="Subtitle"
                  value={bestSellersSubtitle}
                  onChange={(e)=>setBestSellersSubtitle(e.target.value)}
                />

                <input
                  type="number"
                  min={1}
                  max={20}
                  value={bestSellersCount}
                  onChange={(e) =>
                    setBestSellersCount(
                      Math.min(20, Math.max(1, Number(e.target.value) || 1))
                    )
                  }
                  className="w-full rounded-lg border p-3"
                />

                <label className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={bestSellersEnabled}
                    onChange={(e)=>
                      setBestSellersEnabled(e.target.checked)
                    }
                  />

                  Enable Best Sellers

                </label>

              </div>

            </div>

            <div className="mt-10 rounded-2xl border bg-white p-8">

              <h2 className="text-2xl font-semibold">
                Testimonials
              </h2>

              <div className="mt-6 space-y-4">

                <input
                  className="w-full rounded-lg border p-3"
                  placeholder="Section Title"
                  value={testimonialsTitle}
                  onChange={(e)=>setTestimonialsTitle(e.target.value)}
                />

                <textarea
                  rows={3}
                  className="w-full rounded-lg border p-3"
                  placeholder="Subtitle"
                  value={testimonialsSubtitle}
                  onChange={(e)=>setTestimonialsSubtitle(e.target.value)}
                />

                <label className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={testimonialsEnabled}
                    onChange={(e)=>
                      setTestimonialsEnabled(e.target.checked)
                    }
                  />

                  Enable Testimonials

                </label>

              </div>

            </div>

            <div className="mt-10 rounded-2xl border bg-white p-8">

              <h2 className="text-2xl font-semibold">
                Newsletter
              </h2>

              <div className="mt-6 space-y-4">

                <input
                  className="w-full rounded-lg border p-3"
                  placeholder="Section Title"
                  value={newsletterTitle}
                  onChange={(e)=>setNewsletterTitle(e.target.value)}
                />

                <textarea
                  rows={3}
                  className="w-full rounded-lg border p-3"
                  placeholder="Subtitle"
                  value={newsletterSubtitle}
                  onChange={(e)=>setNewsletterSubtitle(e.target.value)}
                />

                <label className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={newsletterEnabled}
                    onChange={(e)=>
                      setNewsletterEnabled(e.target.checked)
                    }
                  />

                  Enable Newsletter

                </label>

              </div>

            </div>

            <div className="mt-6 space-y-4">

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Section Title"
                value={featuredCollectionsTitle}
                onChange={(e)=>setFeaturedCollectionsTitle(e.target.value)}
              />

              <textarea
                rows={3}
                className="w-full rounded-lg border p-3"
                placeholder="Subtitle"
                value={featuredCollectionsSubtitle}
                onChange={(e)=>setFeaturedCollectionsSubtitle(e.target.value)}
              />

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Number of Featured Collections
                </label>

                <input
                  type="number"
                  min={1}
                  max={20}
                  value={featuredCollectionsCount}
                  onChange={(e) =>
                    setFeaturedCollectionsCount(
                      Math.max(1, Number(e.target.value) || 1)
                    )
                  }
                  className="w-full rounded-lg border p-3"
                />

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Controls how many featured products appear on the homepage.
                </p>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={featuredCollectionsEnabled}
                  onChange={(e)=>
                    setFeaturedCollectionsEnabled(e.target.checked)
                  }
                />
                Enable Featured Collections
              </label>
            </div>
          </div>

            <div className="mt-6 space-y-4">

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Section Title"
                value={newArrivalsTitle}
                onChange={(e)=>setNewArrivalsTitle(e.target.value)}
              />

              <textarea
                rows={3}
                className="w-full rounded-lg border p-3"
                placeholder="Subtitle"
                value={newArrivalsSubtitle}
                onChange={(e)=>setNewArrivalsSubtitle(e.target.value)}
              />

              <input
                type="number"
                min={1}
                max={20}
                value={newArrivalsCount}
                onChange={(e) =>
                  setNewArrivalsCount(
                    Math.min(20, Math.max(1, Number(e.target.value) || 1))
                  )
                }
                className="w-full rounded-lg border p-3"
              />

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={newArrivalsEnabled}
                  onChange={(e)=>
                    setNewArrivalsEnabled(e.target.checked)
                  }
                />

                Enable New Arrivals

              </label>

            </div>

          </div>

          <div className="mt-6 space-y-4">

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Section Title"
              value={featuredCategoriesTitle}
              onChange={(e)=>setFeaturedCategoriesTitle(e.target.value)}
            />

            <textarea
              rows={3}
              className="w-full rounded-lg border p-3"
              placeholder="Subtitle"
              value={featuredCategoriesSubtitle}
              onChange={(e)=>setFeaturedCategoriesSubtitle(e.target.value)}
            />

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={featuredCategoriesEnabled}
                onChange={(e)=>
                  setFeaturedCategoriesEnabled(e.target.checked)
                }
              />

              Enable Featured Categories

            </label>

          </div>

        </div>

          <div className="mt-6 space-y-4">

            <input
              className="w-full rounded-lg border p-3"
              value={heroTitle}
              placeholder="Hero Title"
              onChange={(e) => setHeroTitle(e.target.value)}
            />

            <textarea
              className="w-full rounded-lg border p-3"
              rows={4}
              value={heroSubtitle}
              placeholder="Hero Subtitle"
              onChange={(e) => setHeroSubtitle(e.target.value)}
            />

            <input
              className="w-full rounded-lg border p-3"
              value={heroButtonText}
              placeholder="Button Text"
              onChange={(e) => setHeroButtonText(e.target.value)}
            />

            <input
              className="w-full rounded-lg border p-3"
              value={heroButtonUrl}
              placeholder="Button URL"
              onChange={(e) => setHeroButtonUrl(e.target.value)}
            />

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={heroEnabled}
                onChange={(e)=>
                  setHeroEnabled(e.target.checked)
                }
              />

              Enable Hero Section

            </label>

            <button
              onClick={saveSettings}
              disabled={loading}
              className="rounded-xl bg-black px-6 py-3 text-white"
            >
              {loading ? "Saving..." : "Save"}
            </button>

          </div>

        </div>

      </section>
    </Container>
  );
}