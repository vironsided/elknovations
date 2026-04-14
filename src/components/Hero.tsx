import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useBrand, useHero } from "../hooks/useSiteData";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  const { data: brand } = useBrand();
  const { data: hero } = useHero();

  return (
    <section id="hero" className="relative bg-black pb-6 pt-[4.5rem] md:px-6 lg:px-8 lg:pb-8">
      {/*
        Rounded top “card” sits under the fixed black header (Refit-style):
        large border-radius on the main hero surface.
      */}
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-t-[1.75rem] bg-black sm:rounded-t-[2rem] lg:min-h-[calc(100svh-4.5rem-1rem)] lg:rounded-t-[2.5rem]">
        <div className="grid min-h-[min(100svh,920px)] grid-cols-1 lg:grid-cols-2 lg:min-h-[calc(100svh-4.5rem-2rem)]">
          <div className="relative z-10 flex flex-col justify-center px-6 pb-12 pt-10 md:px-12 lg:px-14 lg:pb-16 lg:pt-12">
            <motion.span
              custom={0}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
              {hero.badge}
            </motion.span>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-[3.25rem]"
            >
              {brand.tagline}
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="mt-6 max-w-md text-base leading-relaxed text-neutral-400 md:text-lg"
            >
              {brand.lead}
            </motion.p>

            <motion.div custom={3} initial="hidden" animate="show" variants={fadeUp} className="mt-10">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                {hero.cta}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition group-hover:scale-105">
                  <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
                </span>
              </a>
            </motion.div>
          </div>

          <div className="relative min-h-[48vh] lg:min-h-0">
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full min-h-[48vh] p-4 pt-2 sm:p-5 lg:absolute lg:inset-0 lg:min-h-full lg:p-6 lg:pl-2"
            >
              <div className="relative h-full min-h-[44vh] overflow-hidden rounded-2xl lg:min-h-0 lg:rounded-3xl">
                <img
                  src={hero.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent lg:bg-gradient-to-l lg:from-black/45" />

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                  className="absolute bottom-5 left-5 right-5 max-w-md rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-auto"
                >
                  <div className="mb-2 flex gap-0.5 text-white" aria-label="5 stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-white/95">&ldquo;{hero.quote}&rdquo;</p>
                  <p className="mt-2 text-xs font-medium text-white/60">— {hero.quoteAuthor}</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
