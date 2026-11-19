import { useEffect, useMemo, useState } from "react";
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
  images: string[];
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
  images: [],
};

const EMPTY_CONTACT: Contact = {
  badge: "",
  title: "",
  intro: "",
  office: "",
  email: "",
  phone: "",
};

// ---------------------------------------------------------------------------
// Data loading for the public site.
// Reads Supabase through plain PostgREST requests, so supabase-js stays out of the
// main bundle (the admin panel still uses it). Every table is requested once per
// page load and shared by all components. Site settings arrive in one request that
// starts as soon as this module loads, and the last copy is kept in localStorage so
// repeat visits can paint the hero before the network answers.

const REST_URL = String(import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
const REST_KEY = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "");
const dataConfigured = Boolean(REST_URL && REST_KEY);

async function restSelect<T>(table: string, query: string): Promise<T[]> {
  const res = await fetch(`${REST_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: REST_KEY, Authorization: `Bearer ${REST_KEY}` },
  });
  if (!res.ok) throw new Error(`Failed to load ${table}: HTTP ${res.status}`);
  return (await res.json()) as T[];
}

const pendingRows = new Map<string, Promise<unknown[]>>();
const loadedRows = new Map<string, unknown[]>();

function loadRows<T>(cacheKey: string, table: string, query: string): Promise<T[]> {
  let request = pendingRows.get(cacheKey);
  if (!request) {
    request = restSelect<unknown>(table, query).then((rows) => {
      loadedRows.set(cacheKey, rows);
      return rows;
    });
    // Forget failed requests so the next component mount can retry.
    request.catch(() => pendingRows.delete(cacheKey));
    pendingRows.set(cacheKey, request);
  }
  return request as Promise<T[]>;
}

function useRows<T>(cacheKey: string, table: string, query: string): { data: T[]; loading: boolean } {
  const cached = loadedRows.get(cacheKey) as T[] | undefined;
  const [data, setData] = useState<T[]>(cached ?? []);
  const [loading, setLoading] = useState(dataConfigured && !cached);

  useEffect(() => {
    if (!dataConfigured) return;
    let cancelled = false;
    loadRows<T>(cacheKey, table, query).then(
      (rows) => {
        if (cancelled) return;
        setData(rows);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        if (!cancelled) setLoading(false);
      },
    );
    return () => { cancelled = true; };
  }, [cacheKey, table, query]);

  return { data, loading };
}

function useFetch<T>(table: string, orderBy = "sort_order"): { data: T[]; loading: boolean } {
  const query = `select=*&order=${orderBy}.asc`;
  return useRows<T>(`${table}?${query}`, table, query);
}

type SettingsMap = Record<string, unknown>;
const SETTINGS_STORAGE_KEY = "elk:site-settings:v1";

function readStoredSettings(): SettingsMap | null {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SettingsMap) : null;
  } catch {
    return null;
  }
}

let settingsSnapshot: SettingsMap | null = typeof window === "undefined" ? null : readStoredSettings();

declare global {
  interface Window {
    /** Settings request started by the inline script in index.html, before this bundle loads. */
    __elkSettings?: Promise<SettingsMap>;
  }
}

function fetchSettings(): Promise<SettingsMap> {
  const early = typeof window === "undefined" ? undefined : window.__elkSettings;
  if (early) return early;
  return restSelect<{ key: string; value: unknown }>("site_settings", "select=key,value").then((rows) =>
    Object.fromEntries(rows.map((row) => [row.key, row.value])),
  );
}

const settingsRequest: Promise<SettingsMap> | null = dataConfigured
  ? fetchSettings().then((map) => {
      settingsSnapshot = map;
      try {
        window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(map));
      } catch {
        // Storage can be unavailable (private mode, quota); the live data is still used.
      }
      return map;
    })
  : null;
settingsRequest?.catch((error) => console.error(error));

function useSetting<T>(key: string, fallback: T): { data: T; loading: boolean } {
  const [data, setData] = useState<T>(() => (settingsSnapshot?.[key] as T | undefined) ?? fallback);
  const [loading, setLoading] = useState(dataConfigured);

  useEffect(() => {
    if (!settingsRequest) return;
    let cancelled = false;
    settingsRequest.then(
      (map) => {
        if (cancelled) return;
        if (map[key]) setData(map[key] as T);
        setLoading(false);
      },
      () => {
        if (!cancelled) setLoading(false);
      },
    );
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

type WorkCaseRow = Omit<WorkCase, "before_images" | "after_images">;

export function useWorkCases(selectedCategory = "all"): { data: WorkCase[]; loading: boolean } {
  let query = "select=*,work_categories(id,name,slug)&order=sort_order.asc";
  if (selectedCategory !== "all") query += `&category_id=eq.${encodeURIComponent(selectedCategory)}`;
  const { data: rows, loading } = useRows<WorkCaseRow>(`work_cases:${selectedCategory}`, "work_cases", query);

  const data = useMemo(
    () =>
      rows.map((row) => {
        const beforeImages = parseImageField(row.before_image_url);
        const afterImages = parseImageField(row.after_image_url);
        return {
          ...row,
          before_image_url: beforeImages[0] ?? "",
          after_image_url: afterImages[0] ?? "",
          before_images: beforeImages,
          after_images: afterImages,
        };
      }),
    [rows],
  );

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
