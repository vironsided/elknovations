import { motion } from "framer-motion";
import { useAbout } from "../hooks/useSiteData";

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
  const { data: about } = useAbout();
  if (!about.badge && !about.title && !about.body) return null;

  return (
    <section id="about" className="scroll-mt-24 bg-white py-20 md:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14">
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
      </div>
    </section>
  );
}
