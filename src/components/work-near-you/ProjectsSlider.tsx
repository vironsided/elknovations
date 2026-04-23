import { useMemo, useRef } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { WorkCase } from "../../hooks/useSiteData";

type Props = { cases: WorkCase[] };

function formatDate(value: string | null): string {
  if (!value) return "";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export function ProjectsSlider({ cases }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const sorted = useMemo(() => {
    return [...cases].sort((a, b) => {
      const da = a.completed_at ? new Date(a.completed_at).getTime() : 0;
      const db = b.completed_at ? new Date(b.completed_at).getTime() : 0;
      return db - da;
    });
  }, [cases]);

  if (sorted.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-500">
        No projects match your search.
      </p>
    );
  }

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.9, 420);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sorted.map((c) => {
          const img = c.after_image_url || c.before_image_url;
          return (
            <article
              key={c.id}
              className="group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md sm:w-[320px]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                {img ? (
                  <img
                    src={img}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                    No photo yet
                  </div>
                )}
                {c.work_categories?.name && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 backdrop-blur">
                    {c.work_categories.name}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h4 className="text-sm font-semibold text-neutral-900">
                  {c.title}
                </h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                  {c.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {c.location}
                    </span>
                  )}
                  {c.completed_at && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(c.completed_at)}
                    </span>
                  )}
                </div>
                {c.summary && (
                  <p className="line-clamp-3 text-xs leading-relaxed text-neutral-600">
                    {c.summary}
                  </p>
                )}
                <Link
                  to="/work"
                  className="mt-auto inline-flex w-fit items-center gap-1 text-xs font-semibold text-neutral-900 underline-offset-2 hover:underline"
                >
                  View details →
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {sorted.length > 1 && (
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous projects"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next projects"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
