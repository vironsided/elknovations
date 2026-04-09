import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "../data/site";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-white px-5 py-20 md:px-10 lg:px-14 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12 lg:gap-16">
        <motion.div
          className="lg:col-span-4"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className="mb-4 inline-block rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            FAQs
          </span>
          <h2 className="text-4xl font-semibold tracking-tight text-black md:text-[2.5rem]">
            Answering your questions
          </h2>
          <p className="mt-4 text-lg text-neutral-600">More questions? Reach out—we’re happy to help.</p>
          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-neutral-300 bg-neutral-100 px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200/80"
          >
            Get in touch
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M7 17L17 7M17 7H9M17 7V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </motion.div>

        <div className="flex flex-col gap-3 lg:col-span-8">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                layout
                className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                >
                  <span className="text-base font-semibold text-black md:text-lg">{item.q}</span>
                  <span className="shrink-0 text-xl font-light text-neutral-400" aria-hidden>
                    {isOpen ? "×" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-600 md:px-6 md:pb-6 md:text-base">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
