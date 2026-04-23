import { useMemo, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { WorkCase } from "../../hooks/useSiteData";

type Props = { cases: WorkCase[]; projectCount: number };

function formatDate(value: string | null): string {
  if (!value) return "";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function ProjectImageStrip({
  before,
  after,
  title,
}: {
  before: string;
  after: string;
  title: string;
}) {
  const slides = [after, before].filter((u) => u && u.trim().length > 0);
  const [index, setIndex] = useState(0);

  if (slides.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-neutral-200/80 text-xs text-neutral-500">
        No photo yet
      </div>
    );
  }

  const i = Math.min(index, slides.length - 1);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
      <img
        src={slides[i]}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition duration-300"
      />
      {slides.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIndex(idx);
              }}
              aria-label={`Photo ${idx + 1} of ${slides.length}`}
              className={`h-2 w-2 rounded-full transition ${
                idx === i ? "bg-white shadow" : "bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
      <span className="sr-only">{title}</span>
    </div>
  );
}

export function ProjectsSlider({ cases, projectCount }: Props) {
  const sorted = useMemo(() => {
    return [...cases].sort((a, b) => {
      const da = a.completed_at ? new Date(a.completed_at).getTime() : 0;
      const db = b.completed_at ? new Date(b.completed_at).getTime() : 0;
      return db - da;
    });
  }, [cases]);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 id="wny-projects-title" className="text-base font-bold text-neutral-900">
          Featured projects
        </h3>
        <p className="text-xs font-medium text-neutral-500">
          {projectCount} project{projectCount === 1 ? "" : "s"}
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white/80 p-6 text-sm text-neutral-500 shadow-sm">
          <p className="font-medium text-neutral-600">No projects match your search</p>
          <p className="mt-1 text-xs text-neutral-500">
            Try another address or zip, or clear the search field.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sorted.map((c) => (
            <article
              key={c.id}
              id={`wny-project-${c.id}`}
              className="scroll-mt-4 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative">
                <ProjectImageStrip
                  before={c.before_image_url}
                  after={c.after_image_url}
                  title={c.title}
                />
                {c.work_categories?.name && (
                  <span className="absolute left-2.5 top-2.5 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-800 shadow-sm backdrop-blur-sm">
                    {c.work_categories.name}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5 p-3.5">
                <h4 className="text-sm font-bold leading-snug text-neutral-900">
                  {c.title}
                </h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-neutral-500">
                  {c.location && (
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {c.location}
                    </span>
                  )}
                  {c.completed_at && (
                    <span className="inline-flex items-center gap-0.5">
                      <CalendarDays className="h-3 w-3 shrink-0" />
                      {formatDate(c.completed_at)}
                    </span>
                  )}
                </div>
                {c.summary && (
                  <p className="line-clamp-3 text-[12px] leading-relaxed text-neutral-600">
                    {c.summary}
                  </p>
                )}
                <Link
                  to="/work"
                  className="mt-1 inline-flex w-fit items-center text-[12px] font-bold text-blue-600 hover:text-blue-500 hover:underline"
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
