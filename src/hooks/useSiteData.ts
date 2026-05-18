import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { parseImageField } from "../utils/imageFields";
import type { ServiceItem } from "../data/site";

export type Project = {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  quote: string;
  author: string;
  image_url: string;
  theme: "light" | "dark";
  sort_order: number;
};

export type FAQ = { id: string; question: string; answer: string; sort_order: number };
export type Testimonial = { id: string; name: string; text: string; sort_order: number };
export type SocialLink = { id: string; platform: string; url: string; sort_order: number };
export type WorkCategory = { id: string; name: string; slug: string; sort_order: number };
export type WorkCase = {
  id: string;
  category_id: string | null;
  title: string;
  location: string;
  completed_at: string | null;
  summary: string;
  scope_details: string;
  materials: string;
  total_price_usd: number;
  before_image_url: string;
  after_image_url: string;
  before_images: string[];
  after_images: string[];
  latitude: number | null;
  longitude: number | null;
  sort_order: number;
  work_categories?: { id: string; name: string; slug: string } | null;
};

export type GoogleReview = {
  id: string;
  author_name: string;
  author_initial: string;
  rating: number;
  review_text: string;
  review_date: string;
  avatar_color: string;
  sort_order: number;
};

export type Transformation = {
  id: string;
  src: string;
  title: string;
  description: string;
  tag: string;
  sort_order: number;
};

type SiteSettings = Record<string, unknown>;

type Brand = {
  name: string;
  short: string;
  tagline: string;
  lead: string;
};

type Hero = {
  badge: string;
  cta: string;
  image: string;
  quote: string;
  quoteAuthor: string;
};

type About = {
  badge: string;
  title: string;
  body: string;
};

type Contact = {
  badge: string;
  title: string;
  intro: string;
  office: string;
  email: string;
  phone: string;
};

type StatItem = {
  value: string;
  label: string;
  sub: string;
};

const EMPTY_BRAND: Brand = {
  name: "",
  short: "",
  tagline: "",
  lead: "",
};

const EMPTY_HERO: Hero = {
  badge: "",
  cta: "",
  image: "",
  quote: "",
  quoteAuthor: "",
};

const EMPTY_ABOUT: About = {
  badge: "",
  title: "",
  body: "",
};

const EMPTY_CONTACT: Contact = {
  badge: "",
  title: "",
  intro: "",
  office: "",
  email: "",
  phone: "",
};

function useFetch<T>(table: string, orderBy = "sort_order"): { data: T[]; loading: boolean } {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    (async () => {
      const { data: rows } = await supabase.from(table).select("*").order(orderBy);
      if (!cancelled) setData((rows as T[]) ?? []);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [table, orderBy]);

  return { data, loading };
}

function useSetting<T>(key: string, fallback: T): { data: T; loading: boolean } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    (async () => {
      const { data: row } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (!cancelled && row?.value) setData(row.value as T);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [key]);

  return { data, loading };
}

export function useServices() {
  return useFetch<ServiceItem & { image_url?: string }>("services");
}

export function useProjects() {
  return useFetch<Project>("projects");
}

export function useFaqs() {
  return useFetch<FAQ>("faqs");
}

export function useTestimonials() {
  const { data, loading } = useFetch<Testimonial>("testimonials");
  const uniqueByText = new Map<string, Testimonial>();
  data.forEach((item) => {
    const key = (item.text ?? "").trim().toLowerCase();
    if (!key || uniqueByText.has(key)) return;
    uniqueByText.set(key, item);
  });
  return { data: Array.from(uniqueByText.values()), loading };
}

export function useBrand() { return useSetting("brand", EMPTY_BRAND); }
export function useHero() { return useSetting("hero", EMPTY_HERO); }
export function useAbout() { return useSetting("about", EMPTY_ABOUT); }
export function useContact() { return useSetting("contact", EMPTY_CONTACT); }
export function useStats() {
  return useSetting<StatItem[]>("stats", []);
}

export function useSocialLinks() {
  return useFetch<SocialLink>("social_links");
}

export function useWorkCategories() {
  return useFetch<WorkCategory>("work_categories");
}

export function useWorkCases(selectedCategory = "all"): { data: WorkCase[]; loading: boolean } {
  const [data, setData] = useState<WorkCase[]>([]);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    (async () => {
      let query = supabase
        .from("work_cases")
        .select("*, work_categories(id, name, slug)")
        .order("sort_order");

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data: rows } = await query;
      if (!cancelled && rows) {
        const normalized = rows.map((row) => {
          const beforeImages = parseImageField(row.before_image_url);
          const afterImages = parseImageField(row.after_image_url);
          return {
            ...row,
            before_image_url: beforeImages[0] ?? "",
            after_image_url: afterImages[0] ?? "",
            before_images: beforeImages,
            after_images: afterImages,
          };
        });
        setData(normalized as WorkCase[]);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [selectedCategory]);

  return { data, loading };
}

export function useSettings(key: string) {
  return useSetting<SiteSettings>(key, {});
}

export function useGoogleReviews() {
  return useFetch<GoogleReview>("google_reviews");
}

export function useTransformations() {
  return useFetch<Transformation>("transformations");
}
