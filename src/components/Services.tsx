import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "../data/site";

const iconStroke = 1.25;

/** Ref-style: fridge + range + stove with hood (line art). */
function IconKitchen({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
    >
      {/* Range hood */}
      <path
        d="M14 4h12l-1.5 4H15.5L14 4z"
        stroke="currentColor"
        strokeWidth={iconStroke}
        strokeLinejoin="round"
      />
      <path d="M15 8h10" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" />
      {/* Fridge (left) */}
      <rect x="3" y="8" width="11" height="27" rx="1" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M8.5 8v27" stroke="currentColor" strokeWidth={iconStroke} />
      <circle cx="6.5" cy="21" r="0.9" fill="currentColor" />
      {/* Stove (right of fridge gap) */}
      <rect x="16" y="14" width="21" height="21" rx="1" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M16 19h21" stroke="currentColor" strokeWidth={iconStroke} />
      <circle cx="21" cy="16.5" r="1.2" stroke="currentColor" strokeWidth={iconStroke} />
      <circle cx="26.5" cy="16.5" r="1.2" stroke="currentColor" strokeWidth={iconStroke} />
      <circle cx="32" cy="16.5" r="1.2" stroke="currentColor" strokeWidth={iconStroke} />
      <rect x="21" y="22" width="11" height="10" rx="0.5" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M24 22v10M29 22v10" stroke="currentColor" strokeWidth={iconStroke} />
    </svg>
  );
}

/** Ref-style: stairs up + small potted plant at base. */
function IconLoft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
    >
      {/* Stairs ascending (side view) */}
      <path
        d="M4 34h9V26h9V18h9V10h5"
        stroke="currentColor"
        strokeWidth={iconStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 34h32" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" />
      {/* Pot + plant */}
      <path
        d="M6 32c0-2 1.5-3 3-3s3 1 3 3"
        stroke="currentColor"
        strokeWidth={iconStroke}
        strokeLinecap="round"
      />
      <path d="M7 32h8" stroke="currentColor" strokeWidth={iconStroke} />
      <path
        d="M9 29v-2M11 28.5l1-2M10 27l2-1"
        stroke="currentColor"
        strokeWidth={iconStroke}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Ref-style: tub + shower head + spray lines. */
function IconBath({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 24c0 6 5.5 10 14 10s14-4 14-10"
        stroke="currentColor"
        strokeWidth={iconStroke}
        strokeLinecap="round"
      />
      <path d="M6 24h28" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" />
      <path d="M10 24V18" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" />
      {/* Shower head */}
      <path d="M8 14h4l1 4h-6l1-4z" stroke="currentColor" strokeWidth={iconStroke} strokeLinejoin="round" />
      <path d="M10 10v4" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" />
      {/* Water spray */}
      <path
        d="M14 17l2 2M16 15l2 2M18 13l2 2"
        stroke="currentColor"
        strokeWidth={iconStroke}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Ref-style: garage front + car silhouette inside. */
function IconExtend({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 34V14L20 6l16 8v20"
        stroke="currentColor"
        strokeWidth={iconStroke}
        strokeLinejoin="round"
      />
      <path d="M4 34h32" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M8 34V20h24v14" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M8 20h24" stroke="currentColor" strokeWidth={iconStroke} />
      {/* Car */}
      <path
        d="M12 28h16l-1.5-4h-13L12 28z"
        stroke="currentColor"
        strokeWidth={iconStroke}
        strokeLinejoin="round"
      />
      <path d="M14 28h12" stroke="currentColor" strokeWidth={iconStroke} />
      <circle cx="16" cy="28" r="1.8" stroke="currentColor" strokeWidth={iconStroke} />
      <circle cx="24" cy="28" r="1.8" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M15 24h10" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" />
    </svg>
  );
}

/** Ref-style: wallpaper roll + paint roller above. */
function IconRestore({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
    >
      {/* Unrolling paper */}
      <path
        d="M6 28c8-2 14-6 18-12"
        stroke="currentColor"
        strokeWidth={iconStroke}
        strokeLinecap="round"
      />
      <ellipse cx="8" cy="28" rx="3" ry="5" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M11 28h18" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" />
      {/* Paint roller */}
      <rect x="22" y="6" width="10" height="5" rx="1" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M27 11v6" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M24 19h6" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" />
      <path d="M27 19v4" stroke="currentColor" strokeWidth={iconStroke} />
    </svg>
  );
}

/** Ref-style: brick courses + masonry trowel on top. */
function IconOutdoor({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
    >
      <path d="M4 32h32" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M4 26h10M18 26h10M32 26h4" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M4 20h6M14 20h10M28 20h8" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M4 14h14M22 14h14" stroke="currentColor" strokeWidth={iconStroke} />
      <path d="M10 14v18M22 14v18" stroke="currentColor" strokeWidth={iconStroke} />
      {/* Trowel */}
      <path
        d="M24 8l6 2-2 6-6-2 2-6z"
        stroke="currentColor"
        strokeWidth={iconStroke}
        strokeLinejoin="round"
      />
      <path d="M28 10l4-3" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" />
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
                    <Ico className="mt-0.5 shrink-0 text-neutral-900" />
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
                        className="overflow-hidden pl-14"
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
