import { motion } from "framer-motion";
import { testimonials } from "../data/site";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-24 border-t border-neutral-200 bg-white px-5 py-20 md:px-10 lg:px-14 lg:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className="mb-4 inline-block rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Testimonials
          </span>
          <h2 className="text-4xl font-semibold tracking-tight text-black md:text-5xl">
            Hear from our clients
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Honest feedback from homeowners who chose Elk Novations.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.05, duration: 0.45 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md ${
                i % 2 === 0 ? "border-neutral-200 bg-white" : "border-transparent bg-neutral-100"
              }`}
            >
              <div className="mb-3 flex gap-0.5 text-black" aria-hidden>
                {"★★★★★".split("").map((s, j) => (
                  <span key={j}>{s}</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-neutral-700">{t.text}</p>
              <p className="mt-4 text-sm font-semibold text-black">{t.name}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
