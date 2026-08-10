export interface HomepageSettings {
  id: number;

  hero_enabled: boolean;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_button_text: string | null;
  hero_button_url: string | null;

  featured_categories_enabled: boolean;
  featured_categories_title: string | null;
  featured_categories_subtitle: string | null;

  new_arrivals_enabled: boolean;
  new_arrivals_title: string | null;
  new_arrivals_subtitle: string | null;
  new_arrivals_count: number;

  featured_collections_enabled: boolean;
  featured_collections_title: string | null;
  featured_collections_subtitle: string | null;
  featured_collections_count: number;

  why_choose_us_enabled: boolean;
  why_choose_us_title: string | null;
  why_choose_us_subtitle: string | null;

  best_sellers_enabled: boolean;
  best_sellers_title: string | null;
  best_sellers_subtitle: string | null;
  best_sellers_count: number;

  testimonials_enabled: boolean;
  testimonials_title: string | null;
  testimonials_subtitle: string | null;

  newsletter_enabled: boolean;
  newsletter_title: string | null;
  newsletter_subtitle: string | null;
}