import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, VolumeX, Volume2 } from "lucide-react";
import { useTransformations } from "../hooks/useSiteData";

export function VideoTransformations() {
  const { data: videos } = useTransformations();
  const [activeIdx, setActiveIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const mainRef = useRef<HTMLVideoElement>(null);

  const playMain = useCallback(() => {
    const v = mainRef.current;
    if (!v) return;
    v.load();
    const p = v.play();
    if (p) p.catch(() => {});
  }, []);

  useEffect(() => {
    playMain();
  }, [activeIdx, playMain]);

  const handleThumbClick = (i: number) => {
    if (i !== activeIdx) setActiveIdx(i);
  };

  useEffect(() => {
    if (activeIdx >= videos.length) setActiveIdx(0);
  }, [activeIdx, videos.length]);

  if (videos.length === 0) return null;

  return (
    <section
      id="transformations"
      className="relative overflow-hidden bg-[#070707] px-5 py-20 md:px-10 lg:px-14 lg:py-28"
    >
      {/* Ambient glow pools */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -left-1/4 top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 65%)" }}
        />
        <div
          className="absolute -right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Section header */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-5 inline-flex items-center gap-3 rounded-full border border-amber-500/20 bg-amber-500/8 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
            <span className="h-px w-6 rounded-full bg-amber-400/60" />
            Transformations
            <span className="h-px w-6 rounded-full bg-amber-400/60" />
          </span>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-[3rem]">
            Witness the{" "}
            <span className="gold-shimmer">Difference</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-neutral-400 md:text-lg">
            Real homes. Real results. See what expert craftsmanship looks like in motion.
          </p>
        </motion.div>

        {/* Cinema layout: featured left + thumbnails right */}
        <div className="grid items-start gap-4 lg:grid-cols-[1fr_300px] lg:gap-5">
          {/* ── Featured video ── */}
          <motion.div
            className="relative self-start overflow-hidden rounded-2xl bg-neutral-900 lg:rounded-3xl"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                className="relative aspect-video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <video
                  ref={mainRef}
                  src={videos[activeIdx]?.src ?? ""}
                  className="h-full w-full object-cover"
                  muted={muted}
                  autoPlay
                  loop
                  playsInline
                />

                {/* Bottom gradient + info overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="mb-3 inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400"
                  >
                    {videos[activeIdx]?.tag ?? ""}
                  </motion.span>
                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.4 }}
                    className="text-2xl font-semibold text-white md:text-3xl"
                  >
                    {videos[activeIdx]?.title ?? ""}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.29, duration: 0.4 }}
                    className="mt-1.5 max-w-sm text-sm leading-relaxed text-white/65"
                  >
                    {videos[activeIdx]?.description ?? ""}
                  </motion.p>
                </div>

                {/* Mute toggle */}
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65 hover:border-white/30"
                  aria-label={muted ? "Unmute video" : "Mute video"}
                >
                  {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>

                {/* Video counter */}
                <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-white/60 backdrop-blur-sm">
                  {activeIdx + 1} / {videos.length}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ── Thumbnail rail ── */}
          <div className="grid grid-cols-2 gap-3 lg:max-h-[clamp(360px,52vw,620px)] lg:grid-cols-1 lg:gap-4 lg:overflow-y-auto lg:pr-1">
            {videos.map((video, i) => {
              const isActive = activeIdx === i;
              return (
                <motion.button
                  key={video.id}
                  type="button"
                  onClick={() => handleThumbClick(i)}
                  className="group relative overflow-hidden rounded-xl lg:rounded-2xl"
                  style={{ outline: "none" }}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Thumbnail video (shows poster frame) */}
                  <div className="aspect-video overflow-hidden bg-neutral-900">
                    <video
                      src={video.src}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  </div>

                  {/* Dark overlay */}
                  <div
                    className={`absolute inset-0 transition duration-300 ${
                      isActive ? "bg-black/20" : "bg-black/45 group-hover:bg-black/25"
                    }`}
                  />

                  {/* Active ring */}
                  {isActive && (
                    <motion.div
                      layoutId="active-ring"
                      className="absolute inset-0 rounded-xl lg:rounded-2xl"
                      style={{ boxShadow: "0 0 0 2px #c9a96e, 0 0 18px 0 rgba(201,169,110,0.25)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Play / active indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isActive ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="relative flex h-3 w-3"
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
                        <span className="relative h-3 w-3 rounded-full bg-amber-400" />
                      </motion.span>
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm transition group-hover:border-white/40 group-hover:bg-black/60">
                        <Play size={12} fill="white" className="translate-x-[1px] text-white" />
                      </span>
                    )}
                  </div>

                  {/* Title label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="truncate text-xs font-semibold text-white">{video.title}</p>
                    <p className="mt-0.5 truncate text-[10px] text-white/50">{video.tag}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA row */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-sm text-neutral-500">
            Every project is documented — honest results, no filters.
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20"
          >
            Start your transformation
            <span className="transition group-hover:translate-x-0.5">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
