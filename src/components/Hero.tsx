import { ArrowUpRight } from "lucide-react";
import { useBrand, useHero, useStats } from "../hooks/useSiteData";
import { SmartImage } from "./ui/SmartImage";

// Entrance animations are plain CSS (see .hero-fade-up in index.css) so they start with
// the first paint instead of waiting for JavaScript.
const delay = (i: number) => ({ animationDelay: `${0.12 * i}s` });

export function Hero() {
  const { data: brand } = useBrand();
  const { data: hero } = useHero();
  // Trust badges use the same numbers as the Stats section (Admin → Site Settings → stats),
  // so the two places can't disagree. Fallbacks are used until settings load.
  const { data: stats } = useStats();
  const stat = (label: RegExp, fallback: string) => stats.find((s) => label.test(s.label))?.value || fallback;
  const badges = [
    [stat(/project/i, "250+"), "Projects"],
    [`${stat(/year/i, "12")}yrs`, "Experience"],
    [stat(/satisf/i, "100%"), "Satisfaction"],
  ];
  if (!brand.tagline && !hero.image) return null;

  return (
    <section id="hero" className="relative bg-black pb-6 pt-[4.5rem] md:px-6 lg:px-8 lg:pb-8">
      {/* Ambient luxury glow — subtle warm amber pools */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute right-[5%] top-[15%] h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -left-20 bottom-[10%] h-[350px] w-[350px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)" }}
        />
      </div>

      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-t-[1.75rem] bg-black sm:rounded-t-[2rem] lg:min-h-[calc(100svh-4.5rem-1rem)] lg:rounded-t-[2.5rem]">
        <div className="grid min-h-[min(100svh,920px)] grid-cols-1 lg:grid-cols-2 lg:min-h-[calc(100svh-4.5rem-2rem)]">
          <div className="relative z-10 flex flex-col justify-center px-6 pb-12 pt-10 md:px-12 lg:px-14 lg:pb-16 lg:pt-12">
            <span
              style={delay(0)}
              className="hero-fade-up mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300/90 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
              {hero.badge}
            </span>

            <h1
              style={delay(1)}
              className="hero-fade-up max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-[3.25rem]"
            >
              {brand.tagline}
            </h1>

            <p
              style={delay(2)}
              className="hero-fade-up mt-6 max-w-md text-base leading-relaxed text-neutral-400 md:text-lg"
            >
              {brand.lead}
            </p>

            <div style={delay(3)} className="hero-fade-up mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-200 backdrop-blur-sm transition hover:bg-amber-500/20"
              >
                {hero.cta}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-black transition group-hover:scale-105 group-hover:bg-amber-300">
                  <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden />
                </span>
              </a>
              <a
                href="#work"
                className="text-sm font-medium text-neutral-500 underline underline-offset-4 transition hover:text-neutral-300"
              >
                See our work
              </a>
            </div>

            {/* Trust badges */}
            <div
              style={delay(4)}
              className="hero-fade-up mt-10 flex items-center gap-6 border-t border-white/5 pt-8"
            >
              {badges.map(([val, lbl]) => (
                <div key={lbl} className="text-center">
                  <p className="text-lg font-semibold text-white">{val}</p>
                  <p className="text-xs text-neutral-500">{lbl}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[48vh] lg:min-h-0">
            <div
              className="hero-zoom-in relative h-full min-h-[48vh] p-4 pt-2 sm:p-5 lg:absolute lg:inset-0 lg:min-h-full lg:p-6 lg:pl-2"
            >
              <div className="relative h-full min-h-[44vh] overflow-hidden rounded-2xl lg:min-h-0 lg:rounded-3xl">
                {/* widths and sizes must match the hero preload script in index.html */}
                <SmartImage
                  src={hero.image}
                  widths={[640, 828, 1080, 1600, 2048]}
                  sizes="(min-width: 1024px) 50vw, 70vw"
                  loading="eager"
                  fetchPriority="high"
                  alt=""
                  className="h-full w-full object-cover"
                />
                {/* Gradient: bottom fade + left fade on desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-l lg:from-black/50" />
                {/* Subtle gold tint at top corner */}
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full opacity-30" style={{ background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)" }} />

                <div
                  style={{ animationDelay: "0.55s" }}
                  className="hero-fade-up absolute bottom-5 left-5 right-5 max-w-md rounded-2xl border border-amber-400/15 bg-black/40 p-4 backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-auto"
                >
                  <div className="mb-2 flex gap-0.5 text-amber-400" aria-label="5 stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-white/95">&ldquo;{hero.quote}&rdquo;</p>
                  <p className="mt-2 text-xs font-medium text-white/50">— {hero.quoteAuthor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
