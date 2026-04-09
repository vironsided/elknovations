import { motion } from "framer-motion";
import { stats } from "../data/site";

export function Stats() {
  return (
    <section className="border-y border-neutral-200 bg-white px-5 py-16 md:px-10 lg:px-14 lg:py-20">
      <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center md:text-left"
          >
            <p className="text-4xl font-semibold tracking-tight text-black md:text-5xl">{s.value}</p>
            <p className="mt-2 text-base font-semibold text-black">{s.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">{s.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
