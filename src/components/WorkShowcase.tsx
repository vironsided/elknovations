import { motion } from "framer-motion";
import { useProjects, type Project } from "../hooks/useSiteData";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const img = (project as { image_url?: string; image?: string }).image_url || (project as { image?: string }).image || "";
  const isDark = project.theme === "dark";

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`overflow-hidden rounded-2xl border shadow-lg sm:rounded-3xl ${
        isDark
          ? "border-neutral-800 bg-neutral-950 text-white"
          : "border-neutral-200/80 bg-neutral-100 text-neutral-900"
      }`}
    >
      <div className="grid gap-0 md:grid-cols-2">
        <div className="relative aspect-[4/3] bg-neutral-200/80 md:aspect-auto md:min-h-[340px]">
          {img ? (
            <img
              src={img}
              alt=""
              className="h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              No image
            </div>
          )}
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
          {(project.category || project.duration) && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.category && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isDark ? "bg-white/10 text-white" : "bg-black text-white"
                  }`}
                >
                  {project.category}
                </span>
              )}
              {project.duration && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isDark ? "bg-white/10 text-white" : "bg-black text-white"
                  }`}
                >
                  {project.duration}
                </span>
              )}
            </div>
          )}
          {project.quote && (
            <div
              className={`mt-8 border-t pt-6 ${isDark ? "border-white/10" : "border-neutral-200"}`}
            >
              <p className="text-3xl leading-none opacity-40">&ldquo;</p>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-neutral-300" : "text-neutral-600"
                }`}
              >
                {project.quote}
              </p>
              {project.author && (
                <p className="mt-4 text-sm font-semibold">{project.author}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function WorkShowcase() {
  const { data: projects } = useProjects();

  if (projects.length === 0) return null;

  return (
    <section id="work" className="scroll-mt-24 bg-white px-5 py-20 md:px-10 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
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

        <div className="mt-14 flex flex-col gap-10">
          {projects.map((project, i) => (
            <ProjectCard key={project.id ?? project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
