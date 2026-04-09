import { motion } from "framer-motion";
import { about, galleryImages } from "../data/site";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-white px-5 py-20 md:px-10 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            className="lg:col-span-5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={container}
          >
            <motion.span
              variants={item}
              className="mb-4 inline-block rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
            >
              {about.badge}
            </motion.span>
            <motion.h2
              variants={item}
              className="text-4xl font-semibold leading-[1.1] tracking-tight text-black md:text-5xl lg:text-[2.75rem]"
            >
              {about.title}
            </motion.h2>
          </motion.div>
          <motion.p
            className="text-lg leading-relaxed text-neutral-600 lg:col-span-7 lg:pt-10 lg:text-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {about.body}
          </motion.p>
        </div>

        <motion.div
          className="mt-16 -mx-5 overflow-hidden md:-mx-10 lg:-mx-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="about-gallery-marquee gap-3 md:gap-4">
            {[...galleryImages, ...galleryImages].map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative h-64 w-44 shrink-0 overflow-hidden md:h-80 md:w-52 lg:h-[22rem] lg:w-60"
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover select-none"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
