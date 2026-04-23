import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Star, X } from "lucide-react";
import { useGoogleReviews, useWorkCases } from "../../hooks/useSiteData";
import { ReviewsSlider } from "./ReviewsSlider";
import { ProjectsSlider } from "./ProjectsSlider";

const WorkMap = lazy(() =>
  import("./WorkMap").then((m) => ({ default: m.WorkMap })),
);

type Props = {
  open: boolean;
  onClose: () => void;
};

function averageRating(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

function GoogleGSmall() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function HeaderStars() {
  return (
    <div className="flex items-center gap-px text-amber-400" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-current stroke-0" />
      ))}
    </div>
  );
}

export function WorkNearYouDrawer({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const { data: reviews } = useGoogleReviews();
  const { data: cases } = useWorkCases("all");

  const rating = useMemo(
    () => averageRating(reviews.map((r) => r.rating || 0)),
    [reviews],
  );
  const reviewCount = reviews.length;

  const filteredCases = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter((c) =>
      [c.location, c.title, c.summary, c.work_categories?.name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [cases, query]);

  const pinnedCases = useMemo(
    () =>
      filteredCases.filter(
        (c) => c.latitude != null && c.longitude != null,
      ),
    [filteredCases],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const goToContact = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="wny-overlay"
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            key="wny-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="See work near you"
            className="fixed inset-0 z-50 flex h-[100dvh] max-h-[100dvh] flex-col bg-[#f7f7f8]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="relative border-b border-neutral-200/80 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 md:right-5 md:top-4"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="px-4 pb-5 pt-4 md:px-10 md:pb-6 md:pt-5">
                <h2 className="pr-10 text-center text-[1.35rem] font-bold leading-tight text-neutral-900 md:pr-0 md:text-2xl md:leading-snug">
                  Check out our work in your neighborhood
                </h2>

                <div className="mt-5 flex flex-col gap-4 lg:mt-6 lg:flex-row lg:items-center lg:gap-5">
                  <label className="relative block min-w-0 flex-1">
                    <span className="sr-only">Address, neighborhood, or zip</span>
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Address, neighborhood, or zip code"
                      className="w-full rounded-xl border-0 bg-neutral-100 py-3 pl-4 pr-12 text-sm text-neutral-900 shadow-inner placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                      <Search className="h-5 w-5" aria-hidden />
                    </span>
                  </label>

                  <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end lg:gap-4">
                    {reviewCount > 0 && (
                      <div className="flex items-center gap-2.5 text-sm text-neutral-800">
                        <GoogleGSmall />
                        <span className="font-bold tabular-nums">{rating.toFixed(1)}</span>
                        <HeaderStars />
                        <span className="text-neutral-500">({reviewCount})</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={goToContact}
                      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500 active:bg-blue-700"
                    >
                      Contact us
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
              <div className="min-h-0 w-full flex-[0_0_auto] overflow-y-auto border-neutral-200/80 bg-[#f7f7f8] px-4 py-5 md:px-8 lg:max-w-[46%] lg:flex-[0_0_44%] lg:border-r">
                <div className="mx-auto max-w-2xl space-y-10 pb-8 lg:max-w-none">
                  <section aria-labelledby="wny-reviews-title">
                    <ReviewsSlider reviews={reviews} />
                  </section>

                  <section aria-labelledby="wny-projects-title">
                    <ProjectsSlider cases={filteredCases} projectCount={filteredCases.length} />
                  </section>
                </div>
              </div>

              <div className="relative min-h-[min(50vh,420px)] w-full min-w-0 flex-1 border-t border-neutral-200/80 bg-neutral-200 shadow-[inset_0_1px_0_rgba(0,0,0,0.04)] lg:min-h-0 lg:border-t-0">
                <Suspense
                  fallback={
                    <div className="flex h-full min-h-[min(50vh,420px)] items-center justify-center text-sm text-neutral-500">
                      Loading map…
                    </div>
                  }
                >
                  <WorkMap
                    cases={pinnedCases}
                    onMarkerClickId={(id) => {
                      const el = document.getElementById(`wny-project-${id}`);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                        el.classList.add("ring-2", "ring-blue-500", "ring-offset-2");
                        window.setTimeout(() => {
                          el.classList.remove("ring-2", "ring-blue-500", "ring-offset-2");
                        }, 2000);
                      }
                    }}
                  />
                </Suspense>
                {pinnedCases.length > 0 && (
                  <p className="pointer-events-none absolute left-2 top-2 z-[400] rounded-md bg-white/90 px-2 py-1 text-[11px] font-medium text-neutral-600 shadow sm:left-3 sm:top-3 sm:text-xs">
                    {pinnedCases.length} job{pinnedCases.length === 1 ? "" : "s"} on map
                  </p>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
