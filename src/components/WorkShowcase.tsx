import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useProjects, type Project } from "../hooks/useSiteData";

function StackCard({
  project,
  index,
  total,
  scrollYProgress,
}: {
  project: Project;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const scale = useTransform(scrollYProgress, (v) => {
    const n = total;
    const start = index / n;
    const end = (index + 1) / n;
    const minScale = 0.88;

    if (index === n - 1) {
      if (v < start) return minScale;
      return 1;
    }
    if (v <= start) return index === 0 ? 1 : minScale;
    if (v >= end) return minScale;
    return 1 - (1 - minScale) * ((v - start) / (end - start));
  });

  const img = (project as { image_url?: string; image?: string }).image_url || (project as { image?: string }).image || "";
  const isDark = project.theme === "dark";

  return (
    <div className="w-full px-3 py-8 sm:px-4 md:px-6 lg:px-8">
      <motion.div
        style={{ scale }}
        className="mx-auto w-full max-w-[min(100%,1800px)] origin-center will-change-transform"
      >
        <article
          className={`relative overflow-hidden rounded-2xl border border-neutral-200/80 shadow-xl sm:rounded-3xl ${
            isDark ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-900"
          }`}
        >
          <div className="grid gap-0 md:grid-cols-2">
            <div className="relative aspect-[4/3] bg-neutral-200/80 md:aspect-auto md:min-h-[380px]">
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{project.title}</h3>
              <p
                className={`mt-4 text-sm leading-relaxed md:text-base ${
                  isDark ? "text-neutral-300" : "text-neutral-600"
                }`}
              >
                {project.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isDark ? "bg-white/10 text-white" : "bg-black text-white"
                  }`}
                >
                  {project.category}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isDark ? "bg-white/10 text-white" : "bg-black text-white"
                  }`}
                >
                  {project.duration}
                </span>
              </div>
              <div
                className={`mt-8 border-t pt-6 ${isDark ? "border-white/10" : "border-neutral-200"}`}
              >
                <p className="text-3xl leading-none opacity-40">“</p>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-neutral-300" : "text-neutral-600"
                  }`}
                >
                  {project.quote}
                </p>
                <p className="mt-4 text-sm font-semibold">{project.author}</p>
              </div>
            </div>
          </div>
        </article>
      </motion.div>
    </div>
  );
}

export function WorkShowcase() {
  const { data: projects } = useProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const n = projects.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(n - 1, Math.max(0, Math.floor(v * n + 0.001)));
    setActiveIndex(idx);
  });

  return (
    <section id="work" className="scroll-mt-24 bg-white">
      <div className="mx-auto max-w-[1400px] px-5 pb-8 pt-20 text-center md:px-10 md:pb-10 lg:px-14 lg:pt-28">
        <span className="mb-4 inline-block rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          Our work
        </span>
        <h2 className="text-4xl font-semibold tracking-tight text-black md:text-5xl">
          Get inspired by our work
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          See how we transform homes with craftsmanship and attention to detail.
        </p>
        <p className="mt-3 text-sm text-neutral-500">
          Scroll down — each project stacks over the last.
        </p>
      </div>

      <div ref={containerRef} className="relative">
        {projects.map((project, index) => (
          <div key={project.title} className="min-h-[100vh]">
            <div
              className="sticky top-0 flex min-h-screen items-center justify-center"
              style={{ zIndex: index + 1 }}
            >
              <StackCard
                project={project}
                index={index}
                total={n}
                scrollYProgress={scrollYProgress}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 pb-20 pt-6 md:pb-28">
        {projects.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === activeIndex ? "w-8 bg-black" : "w-2 bg-neutral-300"
            }`}
            aria-hidden
          />
        ))}
      </div>
    </section>
  );
}
