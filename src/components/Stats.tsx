import { motion } from "framer-motion";
import { useStats } from "../hooks/useSiteData";

export function Stats() {
  const { data: stats } = useStats();

  if (stats.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-neutral-800 bg-neutral-950 px-5 py-16 md:px-10 lg:px-14 lg:py-24">
      {/* Ambient warm glow centered */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden
        style={{ background: "radial-gradient(ellipse, rgba(201,169,110,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto grid max-w-[1400px] gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative px-6 py-2 text-center md:text-left"
          >
            {/* Vertical divider on desktop (skip first) */}
            {i > 0 && (
              <span className="absolute left-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-white/8 lg:block" aria-hidden />
            )}

            <p className="text-4xl font-semibold tracking-tight md:text-5xl gold-shimmer">
              {s.value}
            </p>
            <p className="mt-2 text-base font-semibold text-white">{s.label}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{s.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
