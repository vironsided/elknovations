import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../data/site";

export function WorkShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % projects.length);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const current = projects[index];

  return (
    <section id="work" className="scroll-mt-24 bg-white px-5 py-20 md:px-10 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className="mb-4 inline-block rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Our work
          </span>
          <h2 className="text-4xl font-semibold tracking-tight text-black md:text-5xl">
            Get inspired by our work
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            See how we transform homes with craftsmanship and attention to detail.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-14 max-w-5xl">
          <div className="relative min-h-[420px] md:min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.article
                key={current.title}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`relative overflow-hidden rounded-3xl border border-neutral-200/80 shadow-xl ${
                  current.theme === "dark"
                    ? "bg-neutral-950 text-white"
                    : "bg-neutral-100 text-neutral-900"
                }`}
              >
                <div className="grid gap-0 md:grid-cols-2">
                  <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[380px]">
                    <img
                      src={current.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{current.title}</h3>
                    <p
                      className={`mt-4 text-sm leading-relaxed md:text-base ${
                        current.theme === "dark" ? "text-neutral-300" : "text-neutral-600"
                      }`}
                    >
                      {current.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          current.theme === "dark"
                            ? "bg-white/10 text-white"
                            : "bg-black text-white"
                        }`}
                      >
                        {current.category}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          current.theme === "dark"
                            ? "bg-white/10 text-white"
                            : "bg-black text-white"
                        }`}
                      >
                        {current.duration}
                      </span>
                    </div>
                    <div
                      className={`mt-8 border-t pt-6 ${
                        current.theme === "dark" ? "border-white/10" : "border-neutral-200"
                      }`}
                    >
                      <p className="text-3xl leading-none opacity-40">“</p>
                      <p
                        className={`text-sm leading-relaxed ${
                          current.theme === "dark" ? "text-neutral-300" : "text-neutral-600"
                        }`}
                      >
                        {current.quote}
                      </p>
                      <p className="mt-4 text-sm font-semibold">{current.author}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-black" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
                aria-label={`Project ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
