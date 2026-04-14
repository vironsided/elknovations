import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabase";
import { ImageUpload } from "./ImageUpload";
import {
  brand as defaultBrand,
  hero as defaultHero,
  about as defaultAbout,
  contact as defaultContact,
  stats as defaultStats,
} from "../../data/site";

type BrandData = typeof defaultBrand;
type HeroData = typeof defaultHero;
type AboutData = typeof defaultAbout;
type ContactData = typeof defaultContact;
type StatsData = typeof defaultStats;

async function loadSetting<T>(key: string, fallback: T): Promise<T> {
  if (!supabaseConfigured) return fallback;
  const { data } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
  return (data?.value as T) ?? fallback;
}

async function saveSetting(key: string, value: unknown) {
  await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
}

export function SiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [brand, setBrand] = useState<BrandData>(defaultBrand);
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [about, setAbout] = useState<AboutData>(defaultAbout);
  const [contactInfo, setContactInfo] = useState<ContactData>(defaultContact);
  const [statsData, setStatsData] = useState<StatsData>(defaultStats);

  useEffect(() => {
    Promise.all([
      loadSetting("brand", defaultBrand),
      loadSetting("hero", defaultHero),
      loadSetting("about", defaultAbout),
      loadSetting("contact", defaultContact),
      loadSetting("stats", defaultStats),
    ]).then(([b, h, a, c, s]) => {
      setBrand(b);
      setHero(h);
      setAbout(a);
      setContactInfo(c);
      setStatsData(s);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await Promise.all([
      saveSetting("brand", brand),
      saveSetting("hero", hero),
      saveSetting("about", about),
      saveSetting("contact", contactInfo),
      saveSetting("stats", statsData),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-neutral-400" size={28} />
      </div>
    );
  }

  function textField(label: string, value: string, onChange: (v: string) => void, textarea = false) {
    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-600">{label}</label>
        {textarea ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900" />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900" />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Site Settings</h1>
          <p className="mt-1 text-sm text-neutral-500">Edit brand, hero, about, contact info, and stats</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
        >
          <Save size={16} /> {saving ? "Saving…" : "Save all"}
        </button>
      </div>

      {saved && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          Settings saved successfully.
        </p>
      )}

      <div className="mt-8 space-y-8">
        {/* Brand */}
        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Brand</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {textField("Company name", brand.name, (v) => setBrand({ ...brand, name: v }))}
            {textField("Short name", brand.short, (v) => setBrand({ ...brand, short: v }))}
            {textField("Tagline", brand.tagline, (v) => setBrand({ ...brand, tagline: v }))}
            {textField("Lead text", brand.lead, (v) => setBrand({ ...brand, lead: v }), true)}
          </div>
        </section>

        {/* Hero */}
        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Hero Section</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {textField("Badge text", hero.badge, (v) => setHero({ ...hero, badge: v }))}
            {textField("CTA button", hero.cta, (v) => setHero({ ...hero, cta: v }))}
            {textField("Quote", hero.quote, (v) => setHero({ ...hero, quote: v }), true)}
            {textField("Quote author", hero.quoteAuthor, (v) => setHero({ ...hero, quoteAuthor: v }))}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-600">Hero image</label>
              <ImageUpload
                currentUrl={hero.image}
                onUploaded={(url) => setHero({ ...hero, image: url })}
                folder="hero"
              />
            </div>
          </div>
        </section>

        {/* About */}
        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">About</h2>
          <div className="space-y-4">
            {textField("Badge", about.badge, (v) => setAbout({ ...about, badge: v }))}
            {textField("Title", about.title, (v) => setAbout({ ...about, title: v }))}
            {textField("Body", about.body, (v) => setAbout({ ...about, body: v }), true)}
          </div>
        </section>

        {/* Contact info */}
        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Contact Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {textField("Badge", contactInfo.badge, (v) => setContactInfo({ ...contactInfo, badge: v }))}
            {textField("Title", contactInfo.title, (v) => setContactInfo({ ...contactInfo, title: v }))}
            {textField("Intro", contactInfo.intro, (v) => setContactInfo({ ...contactInfo, intro: v }), true)}
            {textField("Office", contactInfo.office, (v) => setContactInfo({ ...contactInfo, office: v }))}
            {textField("Email", contactInfo.email, (v) => setContactInfo({ ...contactInfo, email: v }))}
            {textField("Phone", contactInfo.phone, (v) => setContactInfo({ ...contactInfo, phone: v }))}
          </div>
        </section>

        {/* Stats */}
        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Stats</h2>
          <div className="space-y-4">
            {statsData.map((stat, i) => (
              <div key={i} className="grid gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-4 sm:grid-cols-3">
                {textField(`Value #${i + 1}`, stat.value, (v) => {
                  const next = [...statsData];
                  next[i] = { ...next[i], value: v };
                  setStatsData(next);
                })}
                {textField("Label", stat.label, (v) => {
                  const next = [...statsData];
                  next[i] = { ...next[i], label: v };
                  setStatsData(next);
                })}
                {textField("Sub", stat.sub, (v) => {
                  const next = [...statsData];
                  next[i] = { ...next[i], sub: v };
                  setStatsData(next);
                })}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
