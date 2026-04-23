import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { GoogleReview } from "../../hooks/useSiteData";

type Props = { reviews: GoogleReview[] };

const FALLBACK_COLORS = [
  "#1a73e8",
  "#ea4335",
  "#fbbc04",
  "#34a853",
  "#a142f4",
  "#f29900",
  "#24c1e0",
];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[idx];
}

function getInitial(review: GoogleReview): string {
  if (review.author_initial) return review.author_initial.slice(0, 1).toUpperCase();
  return (review.author_name || "?").trim().slice(0, 1).toUpperCase();
}

function GoogleG() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-4 w-4 shrink-0"
      aria-label="Google"
      role="img"
    >
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

function Stars({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${clamped} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < clamped
              ? "fill-amber-400 text-amber-400"
              : "fill-neutral-200 text-neutral-200"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewsSlider({ reviews }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 340);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 id="wny-reviews-title" className="text-base font-bold text-neutral-900">
          Featured reviews
        </h3>
        {reviews.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous reviews"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200/80 bg-white text-neutral-600 shadow-sm transition hover:bg-neutral-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next reviews"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200/80 bg-white text-neutral-600 shadow-sm transition hover:bg-neutral-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white/80 p-6 text-sm text-neutral-500 shadow-sm">
          <p className="font-medium text-neutral-600">No reviews yet</p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500">
            Add Google-style reviews in the admin under <span className="font-semibold">Google Reviews</span> — they will appear here in a carousel, like on contractor sites.
          </p>
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((r) => {
            const color = r.avatar_color || colorForName(r.author_name || "?");
            return (
              <article
                key={r.id}
                className="flex w-[min(100%,300px)] shrink-0 snap-start flex-col gap-2.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-inner"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  >
                    {getInitial(r)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-neutral-900">
                      {r.author_name || "Anonymous"}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500">
                      <GoogleG />
                      <span>{r.review_date || "Posted on Google"}</span>
                    </div>
                  </div>
                </div>
                <Stars rating={r.rating} />
                <p className="line-clamp-4 text-[0.8125rem] leading-relaxed text-neutral-700">
                  {r.review_text}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
