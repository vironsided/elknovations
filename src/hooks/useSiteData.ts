import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { parseImageField } from "../utils/imageFields";
import {
  services as fallbackServices,
  projects as fallbackProjects,
  transformations as fallbackTransformations,
  faqs as fallbackFaqs,
  testimonials as fallbackTestimonials,
  brand as fallbackBrand,
  hero as fallbackHero,
  about as fallbackAbout,
  contact as fallbackContact,
  stats as fallbackStats,
  type ServiceItem,
} from "../data/site";

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

const PLACEHOLDER_PATTERNS = [
  /template/i,
  /lorem ipsum/i,
  /test/i,
  /qwe/i,
  /asd/i,
  /sample/i,
  /demo/i,
];

function hasPlaceholderText(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const normalized = value.trim();
  if (!normalized) return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(normalized));
}

function hasRealImage(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  return /^https?:\/\//.test(normalized) || normalized.startsWith("/");
}

function wordCount(value: string | undefined): number {
  if (!value) return 0;
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function isValidService(item: { title?: string; description?: string; image_url?: string }) {
  if (hasPlaceholderText(item.title) || hasPlaceholderText(item.description)) return false;
  if (wordCount(item.description) < 10) return false;
  return hasRealImage(item.image_url);
}

function isValidTestimonial(item: { name?: string; text?: string }) {
  if (hasPlaceholderText(item.name) || hasPlaceholderText(item.text)) return false;
  return (item.text?.trim().split(/\s+/).length ?? 0) >= 8;
}

function isValidProject(item: {
  title?: string;
  description?: string;
  quote?: string;
  image_url?: string;
}) {
  if (hasPlaceholderText(item.title) || hasPlaceholderText(item.description) || hasPlaceholderText(item.quote)) {
    return false;
  }
  if (wordCount(item.description) < 12 || wordCount(item.quote) < 8) return false;
  return hasRealImage(item.image_url);
}

function useFetch<T>(table: string, fallback: T[], orderBy = "sort_order"): { data: T[]; loading: boolean } {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    (async () => {
      const { data: rows } = await supabase.from(table).select("*").order(orderBy);
      if (!cancelled && rows && rows.length > 0) setData(rows as T[]);
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
  const mapped = fallbackServices.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    image_url: s.image,
    icon: s.icon,
    sort_order: 0,
  }));
  const { data, loading } = useFetch<ServiceItem & { image_url?: string }>("services", mapped as never[]);
  const cleanData = data.filter((item) => isValidService(item));
  // Keep homepage quality high: if admin data is sparse/noisy, fall back to curated defaults.
  return { data: cleanData.length >= 6 ? cleanData : mapped, loading };
}

export function useProjects() {
  const mapped = fallbackProjects.map((p, i) => ({
    id: String(i),
    title: p.title,
    category: p.category,
    duration: p.duration,
    description: p.description,
    quote: p.quote,
    author: p.author,
    image_url: p.image,
    theme: p.theme,
    sort_order: i,
  }));
  const { data, loading } = useFetch<Project>("projects", mapped);
  const cleanData = data.filter((item) => isValidProject(item));
  return { data: cleanData.length >= 3 ? cleanData : mapped, loading };
}

export function useFaqs() {
  const mapped = fallbackFaqs.map((f, i) => ({
    id: String(i),
    question: f.q,
    answer: f.a,
    sort_order: i,
  }));
  return useFetch<FAQ>("faqs", mapped);
}

export function useTestimonials() {
  const mapped = fallbackTestimonials.map((t, i) => ({
    id: String(i),
    name: t.name,
    text: t.text,
    sort_order: i,
  }));
  const { data, loading } = useFetch<Testimonial>("testimonials", mapped);
  const uniqueByText = new Map<string, Testimonial>();
  data.forEach((item) => {
    const key = (item.text ?? "").trim().toLowerCase();
    if (!key || uniqueByText.has(key)) return;
    uniqueByText.set(key, item);
  });
  const deduped = Array.from(uniqueByText.values());
  const cleanData = deduped.filter((item) => isValidTestimonial(item));
  return { data: cleanData.length >= 12 ? cleanData : mapped, loading };
}

export function useBrand() { return useSetting("brand", fallbackBrand); }
export function useHero() { return useSetting("hero", fallbackHero); }
export function useAbout() { return useSetting("about", fallbackAbout); }
export function useContact() { return useSetting("contact", fallbackContact); }
export function useStats() {
  return useSetting("stats", fallbackStats);
}

export function useSocialLinks() {
  return useFetch<SocialLink>("social_links", []);
}

export function useWorkCategories() {
  return useFetch<WorkCategory>("work_categories", []);
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
  return useFetch<GoogleReview>("google_reviews", []);
}

export function useTransformations() {
  const mapped = fallbackTransformations.map((item, i) => ({
    id: item.id,
    src: item.src,
    title: item.title,
    description: item.description,
    tag: item.tag,
    sort_order: i,
  }));
  return useFetch<Transformation>("transformations", mapped);
}
