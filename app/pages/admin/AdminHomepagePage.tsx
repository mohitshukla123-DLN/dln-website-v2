import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import { supabase } from "../../lib/supabase";
import { getHomepageSettings } from "../../lib/homepage";

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroButtonText, setHeroButtonText] = useState("");
  const [heroButtonUrl, setHeroButtonUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroEnabled, setHeroEnabled] = useState(true);

  const [featuredCategoriesTitle, setFeaturedCategoriesTitle] = useState("");
  const [featuredCategoriesSubtitle, setFeaturedCategoriesSubtitle] =
    useState("");
  const [featuredCategoriesEnabled, setFeaturedCategoriesEnabled] =
    useState(true);

  const [newArrivalsTitle, setNewArrivalsTitle] = useState("");
  const [newArrivalsSubtitle, setNewArrivalsSubtitle] = useState("");
  const [newArrivalsCount, setNewArrivalsCount] = useState(8);
  const [newArrivalsEnabled, setNewArrivalsEnabled] = useState(true);

  const [featuredCollectionsTitle, setFeaturedCollectionsTitle] =
    useState("");
  const [featuredCollectionsSubtitle, setFeaturedCollectionsSubtitle] =
    useState("");
  const [featuredCollectionsCount, setFeaturedCollectionsCount] =
    useState(6);
  const [featuredCollectionsEnabled, setFeaturedCollectionsEnabled] =
    useState(true);

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

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const data = await getHomepageSettings();

    if (!data) return;

    setHeroTitle(data.hero_title ?? "");
    setHeroSubtitle(data.hero_subtitle ?? "");
    setHeroButtonText(data.hero_button_text ?? "");
    setHeroButtonUrl(data.hero_button_url ?? "");
    setHeroImageUrl(data.hero_image_url ?? "");
    setHeroEnabled(data.hero_enabled ?? true);

    setFeaturedCategoriesTitle(data.featured_categories_title ?? "");
    setFeaturedCategoriesSubtitle(
      data.featured_categories_subtitle ?? ""
    );
    setFeaturedCategoriesEnabled(
      data.featured_categories_enabled ?? true
    );

    setNewArrivalsTitle(data.new_arrivals_title ?? "");
    setNewArrivalsSubtitle(data.new_arrivals_subtitle ?? "");
    setNewArrivalsCount(data.new_arrivals_count ?? 8);
    setNewArrivalsEnabled(data.new_arrivals_enabled ?? true);

    setFeaturedCollectionsTitle(
      data.featured_collections_title ?? ""
    );
    setFeaturedCollectionsSubtitle(
      data.featured_collections_subtitle ?? ""
    );
    setFeaturedCollectionsCount(
      data.featured_collections_count ?? 6
    );
    setFeaturedCollectionsEnabled(
      data.featured_collections_enabled ?? true
    );

    setWhyChooseTitle(data.why_choose_us_title ?? "");
    setWhyChooseSubtitle(data.why_choose_us_subtitle ?? "");
    setWhyChooseEnabled(data.why_choose_us_enabled ?? true);

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
  }

  async function uploadHeroImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Hero image must be smaller than 5MB.");
      return;
    }

    setUploadingHero(true);

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `hero-${Date.now()}.${extension}`;

      const { error } = await supabase.storage
        .from("site-assets")
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("site-assets")
        .getPublicUrl(fileName);

      setHeroImageUrl(data.publicUrl);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Hero image upload failed."
      );
    } finally {
      setUploadingHero(false);
    }
  }

  async function saveSettings() {
    setLoading(true);

    const { error } = await supabase
      .from("homepage_settings")
      .update({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_button_text: heroButtonText,
        hero_button_url: heroButtonUrl,
        hero_image_url: heroImageUrl,
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

  function SectionToggle({
    checked,
    onChange,
    children,
  }: {
    checked: boolean;
    onChange: (value: boolean) => void;
    children: React.ReactNode;
  }) {
    return (
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {children}
      </label>
    );
  }

  return (
    <Container>
      <section className="max-w-5xl py-16">
        <h1 className="text-4xl font-bold">Homepage CMS</h1>

        <p className="mt-2 text-[var(--muted)]">
          Manage homepage content and appearance.
        </p>

        <div className="mt-6 rounded-xl border bg-gray-50 p-5">
          <h2 className="text-lg font-semibold">
            Homepage CMS Guide
          </h2>

          <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            <p>
              <strong className="text-[var(--foreground)]">Enable:</strong>{" "}
              Show or hide a homepage section without deleting its content.
            </p>

            <p>
              <strong className="text-[var(--foreground)]">Count:</strong>{" "}
              Controls how many products appear in New Arrivals, Featured
              Collections, and Best Sellers.
            </p>

            <p>
              <strong className="text-[var(--foreground)]">Title:</strong>{" "}
              Controls the main heading displayed for that section.
            </p>

            <p>
              <strong className="text-[var(--foreground)]">Subtitle:</strong>{" "}
              Controls the supporting text displayed below the heading.
            </p>

            <p>
              <strong className="text-[var(--foreground)]">Button URL:</strong>{" "}
              Controls where the Hero button takes visitors. Example:{" "}
              <code>/shop</code>
            </p>

            <p>
              <strong className="text-[var(--foreground)]">Hero Image:</strong>{" "}
              Upload or replace the main homepage Hero image.
            </p>
          </div>
        </div>

        {/* HERO */}
        <div className="mt-10 rounded-2xl border bg-white p-8">
          <h2 className="text-2xl font-semibold">Hero Section</h2>

          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-lg border p-3"
              placeholder="Hero Title"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
            />

            <textarea
              className="w-full rounded-lg border p-3"
              rows={4}
              placeholder="Hero Subtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
            />

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Button Text"
              value={heroButtonText}
              onChange={(e) => setHeroButtonText(e.target.value)}
            />

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Button URL"
              value={heroButtonUrl}
              onChange={(e) => setHeroButtonUrl(e.target.value)}
            />

            <div>
              <label className="mb-2 block text-sm font-medium">
                Hero Image
              </label>

              {heroImageUrl && (
                <div className="mb-4 overflow-hidden rounded-xl border">
                  <img
                    src={heroImageUrl}
                    alt="Hero preview"
                    className="max-h-80 w-full object-contain"
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={uploadHeroImage}
                disabled={uploadingHero}
                className="w-full rounded-lg border p-3"
              />

              {uploadingHero && (
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Uploading hero image...
                </p>
              )}

              {heroImageUrl && (
                <button
                  type="button"
                  onClick={() => setHeroImageUrl("")}
                  className="mt-3 rounded-lg border px-4 py-2 text-sm"
                >
                  Remove Hero Image
                </button>
              )}
            </div>

            <SectionToggle
              checked={heroEnabled}
              onChange={setHeroEnabled}
            >
              Enable Hero Section
            </SectionToggle>
          </div>
        </div>

        {/* FEATURED CATEGORIES */}
        <div className="mt-8 rounded-2xl border bg-white p-8">
          <h2 className="text-2xl font-semibold">
            Featured Categories
          </h2>

          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-lg border p-3"
              placeholder="Section Title"
              value={featuredCategoriesTitle}
              onChange={(e) =>
                setFeaturedCategoriesTitle(e.target.value)
              }
            />

            <textarea
              rows={3}
              className="w-full rounded-lg border p-3"
              placeholder="Subtitle"
              value={featuredCategoriesSubtitle}
              onChange={(e) =>
                setFeaturedCategoriesSubtitle(e.target.value)
              }
            />

            <SectionToggle
              checked={featuredCategoriesEnabled}
              onChange={setFeaturedCategoriesEnabled}
            >
              Enable Featured Categories
            </SectionToggle>
          </div>
        </div>

        {/* NEW ARRIVALS */}
        <div className="mt-8 rounded-2xl border bg-white p-8">
          <h2 className="text-2xl font-semibold">New Arrivals</h2>

          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-lg border p-3"
              placeholder="Section Title"
              value={newArrivalsTitle}
              onChange={(e) => setNewArrivalsTitle(e.target.value)}
            />

            <textarea
              rows={3}
              className="w-full rounded-lg border p-3"
              placeholder="Subtitle"
              value={newArrivalsSubtitle}
              onChange={(e) =>
                setNewArrivalsSubtitle(e.target.value)
              }
            />

            <label className="block text-sm font-medium">
              Products to Display
            </label>

            <input
              type="number"
              min={1}
              max={20}
              className="w-full rounded-lg border p-3"
              value={newArrivalsCount}
              onChange={(e) =>
                setNewArrivalsCount(
                  Math.min(
                    20,
                    Math.max(1, Number(e.target.value) || 1)
                  )
                )
              }
            />

            <SectionToggle
              checked={newArrivalsEnabled}
              onChange={setNewArrivalsEnabled}
            >
              Enable New Arrivals
            </SectionToggle>
          </div>
        </div>

        {/* FEATURED COLLECTIONS */}
        <div className="mt-8 rounded-2xl border bg-white p-8">
          <h2 className="text-2xl font-semibold">
            Featured Collections
          </h2>

          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-lg border p-3"
              placeholder="Section Title"
              value={featuredCollectionsTitle}
              onChange={(e) =>
                setFeaturedCollectionsTitle(e.target.value)
              }
            />

            <textarea
              rows={3}
              className="w-full rounded-lg border p-3"
              placeholder="Subtitle"
              value={featuredCollectionsSubtitle}
              onChange={(e) =>
                setFeaturedCollectionsSubtitle(e.target.value)
              }
            />

            <label className="block text-sm font-medium">
              Products to Display
            </label>

            <input
              type="number"
              min={1}
              max={20}
              className="w-full rounded-lg border p-3"
              value={featuredCollectionsCount}
              onChange={(e) =>
                setFeaturedCollectionsCount(
                  Math.min(
                    20,
                    Math.max(1, Number(e.target.value) || 1)
                  )
                )
              }
            />

            <SectionToggle
              checked={featuredCollectionsEnabled}
              onChange={setFeaturedCollectionsEnabled}
            >
              Enable Featured Collections
            </SectionToggle>
          </div>
        </div>

        {/* WHY CHOOSE US */}
        <div className="mt-8 rounded-2xl border bg-white p-8">
          <h2 className="text-2xl font-semibold">Why Choose Us</h2>

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
              onChange={(e) =>
                setWhyChooseSubtitle(e.target.value)
              }
            />

            <SectionToggle
              checked={whyChooseEnabled}
              onChange={setWhyChooseEnabled}
            >
              Enable Why Choose Us
            </SectionToggle>
          </div>
        </div>

        {/* BEST SELLERS */}
        <div className="mt-8 rounded-2xl border bg-white p-8">
          <h2 className="text-2xl font-semibold">Best Sellers</h2>

          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-lg border p-3"
              placeholder="Section Title"
              value={bestSellersTitle}
              onChange={(e) =>
                setBestSellersTitle(e.target.value)
              }
            />

            <textarea
              rows={3}
              className="w-full rounded-lg border p-3"
              placeholder="Subtitle"
              value={bestSellersSubtitle}
              onChange={(e) =>
                setBestSellersSubtitle(e.target.value)
              }
            />

            <label className="block text-sm font-medium">
              Products to Display
            </label>

            <input
              type="number"
              min={1}
              max={20}
              className="w-full rounded-lg border p-3"
              value={bestSellersCount}
              onChange={(e) =>
                setBestSellersCount(
                  Math.min(
                    20,
                    Math.max(1, Number(e.target.value) || 1)
                  )
                )
              }
            />

            <SectionToggle
              checked={bestSellersEnabled}
              onChange={setBestSellersEnabled}
            >
              Enable Best Sellers
            </SectionToggle>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="mt-8 rounded-2xl border bg-white p-8">
          <h2 className="text-2xl font-semibold">Testimonials</h2>

          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-lg border p-3"
              placeholder="Section Title"
              value={testimonialsTitle}
              onChange={(e) =>
                setTestimonialsTitle(e.target.value)
              }
            />

            <textarea
              rows={3}
              className="w-full rounded-lg border p-3"
              placeholder="Subtitle"
              value={testimonialsSubtitle}
              onChange={(e) =>
                setTestimonialsSubtitle(e.target.value)
              }
            />

            <SectionToggle
              checked={testimonialsEnabled}
              onChange={setTestimonialsEnabled}
            >
              Enable Testimonials
            </SectionToggle>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="mt-8 rounded-2xl border bg-white p-8">
          <h2 className="text-2xl font-semibold">Newsletter</h2>

          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-lg border p-3"
              placeholder="Section Title"
              value={newsletterTitle}
              onChange={(e) =>
                setNewsletterTitle(e.target.value)
              }
            />

            <textarea
              rows={3}
              className="w-full rounded-lg border p-3"
              placeholder="Subtitle"
              value={newsletterSubtitle}
              onChange={(e) =>
                setNewsletterSubtitle(e.target.value)
              }
            />

            <SectionToggle
              checked={newsletterEnabled}
              onChange={setNewsletterEnabled}
            >
              Enable Newsletter
            </SectionToggle>
          </div>
        </div>

        <button
          onClick={saveSettings}
          disabled={loading || uploadingHero}
          className="mt-8 rounded-xl bg-black px-8 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Homepage"}
        </button>
      </section>
    </Container>
  );
}