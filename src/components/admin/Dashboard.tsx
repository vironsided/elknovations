import { useEffect, useState } from "react";
import { FolderKanban, Wrench, HelpCircle, MessageSquareQuote } from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabase";

type Counts = { projects: number; services: number; faqs: number; testimonials: number };

export function Dashboard() {
  const [counts, setCounts] = useState<Counts>({ projects: 0, services: 0, faqs: 0, testimonials: 0 });

  useEffect(() => {
    if (!supabaseConfigured) return;
    Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("services").select("id", { count: "exact", head: true }),
      supabase.from("faqs").select("id", { count: "exact", head: true }),
      supabase.from("testimonials").select("id", { count: "exact", head: true }),
    ]).then(([p, s, f, t]) => {
      setCounts({
        projects: p.count ?? 0,
        services: s.count ?? 0,
        faqs: f.count ?? 0,
        testimonials: t.count ?? 0,
      });
    });
  }, []);

  const cards = [
    { label: "Projects", count: counts.projects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Services", count: counts.services, icon: Wrench, href: "/admin/services" },
    { label: "FAQs", count: counts.faqs, icon: HelpCircle, href: "/admin/faqs" },
    { label: "Testimonials", count: counts.testimonials, icon: MessageSquareQuote, href: "/admin/testimonials" },
  ];

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Overview of your site content</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <c.icon size={22} className="text-neutral-400" strokeWidth={1.5} />
              <span className="text-2xl font-bold text-neutral-900">{c.count}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-neutral-600">{c.label}</p>
          </a>
        ))}
      </div>

      {!supabaseConfigured && (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <strong>Supabase not connected.</strong> Add{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">VITE_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">VITE_SUPABASE_ANON_KEY</code> to your{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">.env</code> file, then restart the dev
          server. The main site will show hardcoded data until connected.
        </div>
      )}
    </div>
  );
}
