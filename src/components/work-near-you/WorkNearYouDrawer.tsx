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
            className="fixed inset-0 z-50 bg-black/50"
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
            className="fixed inset-0 z-50 flex flex-col bg-white"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex flex-col gap-4 border-b border-neutral-200 bg-white px-5 py-4 md:px-10 md:py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Elk Novations
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-neutral-900 md:text-2xl">
                    Check out our work in your neighborhood
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="relative flex w-full items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 md:max-w-md">
                  <Search className="h-4 w-4 text-neutral-500" aria-hidden />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by city, ZIP or project"
                    className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                  />
                </label>

                <div className="flex items-center gap-4">
                  {reviewCount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{rating.toFixed(1)}</span>
                      <span className="text-neutral-500">
                        ({reviewCount} review{reviewCount === 1 ? "" : "s"})
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={goToContact}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
                  >
                    Contact us
                  </button>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-6 md:px-10 md:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
                <div className="flex flex-col gap-10">
                  <section aria-labelledby="wny-reviews-title">
                    <div className="mb-4 flex items-baseline justify-between">
                      <h3 id="wny-reviews-title" className="text-lg font-semibold text-neutral-900">
                        Featured reviews
                      </h3>
                      {reviewCount > 0 && (
                        <p className="text-xs text-neutral-500">
                          {reviewCount} review{reviewCount === 1 ? "" : "s"}
                        </p>
                      )}
                    </div>
                    <ReviewsSlider reviews={reviews} />
                  </section>

                  <section aria-labelledby="wny-projects-title">
                    <div className="mb-4 flex items-baseline justify-between">
                      <h3 id="wny-projects-title" className="text-lg font-semibold text-neutral-900">
                        Featured projects
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {filteredCases.length} project{filteredCases.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <ProjectsSlider cases={filteredCases} />
                  </section>
                </div>

                <section
                  aria-labelledby="wny-map-title"
                  className="flex flex-col"
                >
                  <div className="mb-4 flex items-baseline justify-between">
                    <h3 id="wny-map-title" className="text-lg font-semibold text-neutral-900">
                      Map
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {pinnedCases.length} pinned location
                      {pinnedCases.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="min-h-[360px] flex-1 overflow-hidden rounded-2xl border border-neutral-200 lg:min-h-[540px]">
                    <Suspense
                      fallback={
                        <div className="flex h-full min-h-[360px] items-center justify-center bg-neutral-100 text-sm text-neutral-500">
                          Loading map…
                        </div>
                      }
                    >
                      <WorkMap cases={pinnedCases} />
                    </Suspense>
                  </div>
                </section>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
