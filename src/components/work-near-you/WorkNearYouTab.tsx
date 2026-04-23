import { MapPin } from "lucide-react";

type Props = { onOpen: () => void };

/** Right-edge tab — matches common “contractor / REALWORK” style (blue, vertical label). */
export function WorkNearYouTab({ onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="See work near you"
      className="group fixed right-0 top-1/2 z-40 -translate-y-1/2 flex items-center gap-2 rounded-l-2xl border border-blue-600/20 bg-gradient-to-b from-blue-600 to-blue-700 py-4 pl-3 pr-2 text-white shadow-[0_8px_30px_rgba(37,99,235,0.35)] transition hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
    >
      <span
        className="text-[0.7rem] font-bold uppercase leading-tight tracking-[0.18em] text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.15)]"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        See work near you
      </span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
        <MapPin className="h-4 w-4" aria-hidden="true" />
      </span>
    </button>
  );
}
