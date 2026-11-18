import { useId } from "react";

type Props = {
  className?: string;
  /** Colour of the house mark and the "ELK" word. */
  ink?: string;
  /** Colour of the "NOVATIONS" word. */
  accent?: string;
  /** Hide the wordmark and render the house mark alone. */
  markOnly?: boolean;
};

/**
 * Elk Novations logo: a house with a chimney, a hammer and a wrench cut out of it,
 * followed by the ELK NOVATIONS wordmark (Archivo, loaded in index.html).
 * The tools are a mask, so the mark sits correctly on any background.
 */
export function ElkLogo({ className, ink = "#F3EDE0", accent = "#E9A03B", markOnly = false }: Props) {
  const maskId = `elk-mark-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg viewBox="0 0 200 220" className="h-full w-auto shrink-0" aria-hidden="true">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="220">
            <rect width="200" height="220" fill="#fff" />
            <g fill="#000">
              <g transform="rotate(-45 100 150)">
                <circle cx="100" cy="112" r="20" />
                <rect x="94" y="118" width="12" height="78" rx="6" />
              </g>
              <g transform="rotate(45 100 150)">
                <rect x="94" y="112" width="12" height="86" rx="4" />
                <rect x="72" y="100" width="56" height="22" rx="3" />
              </g>
            </g>
            <g transform="rotate(-45 100 150)" fill="#fff">
              <rect x="93" y="86" width="14" height="24" />
            </g>
          </mask>
        </defs>
        <g mask={`url(#${maskId})`} fill={ink}>
          <path d="M146 46 V24 H170 V66 Z" />
          <path d="M100 6 L192 84 L192 214 L8 214 L8 84 Z" stroke={ink} strokeWidth="10" strokeLinejoin="round" />
        </g>
      </svg>
      {!markOnly && (
        <span
          className="whitespace-nowrap text-[1.15rem] leading-none md:text-[1.3rem]"
          style={{ fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif" }}
        >
          <span className="font-extrabold tracking-[-0.01em]" style={{ color: ink }}>
            ELK
          </span>{" "}
          <span className="font-medium tracking-[0.06em]" style={{ color: accent }}>
            NOVATIONS
          </span>
        </span>
      )}
    </span>
  );
}
