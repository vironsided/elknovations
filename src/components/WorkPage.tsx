import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useWorkCases, useWorkCategories } from "../hooks/useSiteData";

function formatDate(value: string | null) {
  if (!value) return "Date not specified";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

function formatPrice(price: number) {
  if (!Number.isFinite(price) || price <= 0) return "Price on request";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

function CaseImageGrid({ title, label, images }: { title: string; label: "Before" | "After"; images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative flex h-full min-h-56 items-center justify-center bg-neutral-100 text-sm text-neutral-400 sm:min-h-72 lg:min-h-80">
        No {label.toLowerCase()} image
        <span className="absolute left-3 top-3 rounded-full bg-black/80 px-2 py-1 text-xs font-semibold text-white">{label}</span>
      </div>
    );
  }

  const safeIndex = Math.min(activeIndex, images.length - 1);
  const activeImage = images[safeIndex];

  return (
    <div className="relative h-full border-b border-neutral-200 bg-neutral-50 p-3 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <span className="absolute left-5 top-5 z-10 rounded-full bg-black/80 px-2 py-1 text-xs font-semibold text-white">{label}</span>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <img
          src={activeImage}
          alt={`${title} ${label.toLowerCase()} ${safeIndex + 1}`}
          className="h-56 w-full object-cover sm:h-72 lg:h-80"
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 overflow-hidden rounded-lg border transition ${
                index === safeIndex
                  ? "border-neutral-900 ring-1 ring-neutral-900"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
              aria-label={`Show ${label.toLowerCase()} image ${index + 1}`}
            >
              <img
                src={src}
                alt={`${title} ${label.toLowerCase()} thumbnail ${index + 1}`}
                className="h-14 w-20 object-cover sm:h-16 sm:w-24"
              />
            </button>
          ))}
        </div>
      ) : null}
      <div className="mt-2 text-xs font-medium text-neutral-500">
        {images.length} photo{images.length === 1 ? "" : "s"}
      </div>
    </div>
  );
}

function CaseImagesSection({ title, beforeImages, afterImages }: { title: string; beforeImages: string[]; afterImages: string[] }) {
  return (
    <div className="grid border-b border-neutral-200 lg:border-b-0 lg:border-r lg:grid-cols-2">
      <CaseImageGrid title={title} label="Before" images={beforeImages} />
      <CaseImageGrid title={title} label="After" images={afterImages} />
    </div>
  );
}

export function WorkPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: categories } = useWorkCategories();
  const { data: cases } = useWorkCases(selectedCategory);

  const categoryOptions = useMemo(
    () => [{ id: "all", name: "All" }, ...categories.map((c) => ({ id: c.id, name: c.name }))],
    [categories],
  );

  return (
    <main className="min-h-screen bg-neutral-50 px-5 pb-16 pt-28 md:px-10 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Our work
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
              Renovation portfolio
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-600">
              Explore before-and-after projects, detailed scope, materials, and average pricing.
            </p>
          </div>
          <Link
            to="/#work"
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
          >
            Back to homepage
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {categoryOptions.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === c.id
                  ? "bg-black text-white"
                  : "bg-white text-neutral-600 ring-1 ring-neutral-200 hover:text-neutral-900"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {cases.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
            No projects in this category yet.
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            {cases.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.4 }}
                className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm"
              >
                <div className="grid gap-0 lg:grid-cols-2">
                  <CaseImagesSection title={item.title} beforeImages={item.before_images} afterImages={item.after_images} />

                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                        {item.work_categories?.name ?? "Uncategorized"}
                      </span>
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                        {item.location || "Location not specified"}
                      </span>
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                        {formatDate(item.completed_at)}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">{item.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.summary}</p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-neutral-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Work scope</p>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{item.scope_details || "Not provided."}</p>
                      </div>
                      <div className="rounded-xl bg-neutral-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Materials</p>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{item.materials || "Not provided."}</p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-neutral-200 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Average project cost</p>
                      <p className="mt-1 text-2xl font-semibold text-neutral-900">{formatPrice(Number(item.total_price_usd))}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
