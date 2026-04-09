import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "../data/site";

function IconKitchen({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10h16v10H4V10z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 6V4M16 6V4M8 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLoft({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 20h16M4 20V12l8-6 8 6v8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconBath({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12h16v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6zM8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconExtend({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 14h16M4 14l4-8h8l4 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconRestore({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3a9 9 0 109 9M12 7v5l3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconOutdoor({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 20h16M8 20V10l4-4 4 4v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

const icons = [IconKitchen, IconLoft, IconBath, IconExtend, IconRestore, IconOutdoor];

export function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="scroll-mt-24 bg-white px-5 py-20 md:px-10 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-4 inline-block rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Services
          </span>
          <h2 className="text-4xl font-semibold tracking-tight text-black md:text-5xl">What we do</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Find the service that fits your project—we’ll tailor scope, budget, and timeline.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-100 md:aspect-[5/6]">
            <AnimatePresence mode="wait">
              <motion.img
                key={services[active].id}
                src={services[active].image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            </AnimatePresence>
          </div>

          <div className="divide-y divide-neutral-200">
            {services.map((svc, i) => {
              const open = active === i;
              const Ico = icons[i] ?? IconKitchen;
              return (
                <div key={svc.id}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className="flex w-full items-start gap-4 py-5 text-left transition hover:opacity-90"
                  >
                    <Ico className="mt-1 shrink-0 text-neutral-500" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-4">
                        <span className="text-lg font-semibold text-black">{svc.title}</span>
                        <span className="shrink-0 text-xl font-light text-neutral-400" aria-hidden>
                          {open ? "×" : "+"}
                        </span>
                      </span>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden pl-10 md:pl-9"
                      >
                        <p className="pb-5 text-sm leading-relaxed text-neutral-600 md:text-base">
                          {svc.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
