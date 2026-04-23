import type { GoogleReview } from "../../hooks/useSiteData";

type Props = { reviews: GoogleReview[] };

export function ReviewsSlider({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-500">
        No reviews yet. Add Google-style reviews from the admin panel.
      </p>
    );
  }
  return (
    <div className="text-sm text-neutral-600">
      {reviews.length} reviews loaded.
    </div>
  );
}
