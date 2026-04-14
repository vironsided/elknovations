import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import {
  services as fallbackServices,
  projects as fallbackProjects,
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

type SiteSettings = Record<string, unknown>;

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
  return useFetch<ServiceItem & { image_url?: string }>("services", mapped as never[]);
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
  return useFetch<Project>("projects", mapped);
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
  return useFetch<Testimonial>("testimonials", mapped);
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

export function useSettings(key: string) {
  return useSetting<SiteSettings>(key, {});
}
