import { motion } from "framer-motion";
import { testimonials } from "../data/site";

function StarRow() {
  return (
    <div className="mb-3 flex gap-0.5 text-black" aria-hidden>
      {"★★★★★".split("").map((s, j) => (
        <span key={j}>{s}</span>
      ))}
    </div>
  );
}

export function Testimonials() {
  const rowForward = [...testimonials, ...testimonials];
  const reversed = [...testimonials].reverse();
  const rowReverse = [...reversed, ...reversed];

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 overflow-x-hidden border-t border-neutral-200 bg-white py-20 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14">
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
      </div>

      <div className="mt-14 flex w-full flex-col gap-5">
        <div className="w-full overflow-hidden">
          <div className="testimonials-marquee-row py-1">
            {rowForward.map((t, i) => (
              <article
                key={`t-a-${i}`}
                className={`w-80 shrink-0 rounded-2xl border p-6 shadow-sm ${
                  i % 2 === 0 ? "border-neutral-200 bg-white" : "border-transparent bg-neutral-100"
                }`}
              >
                <StarRow />
                <p className="text-sm leading-relaxed text-neutral-700">{t.text}</p>
                <p className="mt-4 text-sm font-semibold text-black">{t.name}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <div className="testimonials-marquee-row testimonials-marquee-row--reverse py-1">
            {rowReverse.map((t, i) => (
              <article
                key={`t-b-${i}`}
                className={`w-80 shrink-0 rounded-2xl border p-6 shadow-sm ${
                  i % 2 === 0 ? "border-neutral-200 bg-neutral-100" : "border-transparent bg-white"
                }`}
              >
                <StarRow />
                <p className="text-sm leading-relaxed text-neutral-700">{t.text}</p>
                <p className="mt-4 text-sm font-semibold text-black">{t.name}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
