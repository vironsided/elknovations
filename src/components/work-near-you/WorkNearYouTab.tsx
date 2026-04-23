import { MapPin } from "lucide-react";

type Props = { onOpen: () => void };

export function WorkNearYouTab({ onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="See work near you"
      className="fixed left-0 top-1/2 z-40 -translate-y-1/2 group flex items-center gap-2 rounded-r-2xl bg-black py-4 pl-2 pr-3 text-white shadow-lg shadow-black/20 transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black/40"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
        <MapPin className="h-4 w-4" aria-hidden="true" />
      </span>
      <span
        className="text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        See work near you
      </span>
    </button>
  );
}
