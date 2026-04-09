import { useState, useRef, type FormEvent } from "react";
import { motion } from "framer-motion";
import { brand, contact, footerLinks } from "../data/site";

const MAX_PHOTOS = 5;
const MAX_BYTES = 5 * 1024 * 1024;

function contactApiUrl(): string {
  const override = import.meta.env.VITE_CONTACT_API_URL?.trim();
  if (override) return override;
  return "/api/contact";
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoError(null);
    const picked = e.target.files ? Array.from(e.target.files) : [];
    if (picked.length === 0) {
      setPhotos([]);
      return;
    }
    const tooBig = picked.find((f) => f.size > MAX_BYTES);
    if (tooBig) {
      setPhotoError(
        `Each file must be ${MAX_BYTES / (1024 * 1024)} MB or smaller (“${tooBig.name}” is too large).`,
      );
      e.target.value = "";
      return;
    }
    if (picked.length > MAX_PHOTOS) {
      setPhotoError(`Please choose at most ${MAX_PHOTOS} images.`);
      e.target.value = "";
      return;
    }
    const nonImages = picked.filter((f) => !f.type.startsWith("image/"));
    if (nonImages.length) {
      setPhotoError("Only image files (JPG, PNG, WebP, HEIC) are allowed.");
      e.target.value = "";
      return;
    }
    setPhotos(picked);
  }

  function clearPhotos() {
    setPhotos([]);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    if (photoError) return;

    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    for (const file of photos) {
      fd.append("attachment", file);
    }

    try {
      const res = await fetch(contactApiUrl(), {
        method: "POST",
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        missing?: string[];
      };

      if (res.ok && data.ok) {
        setSent(true);
        form.reset();
        clearPhotos();
      } else {
        let msg =
          data.error ||
          (res.status === 503
            ? "Email is not configured on the server yet."
            : "Something went wrong. Please try again or email us directly.");
        if (data.missing?.length) {
          msg += ` Missing: ${data.missing.join(", ")}.`;
        }
        setSubmitError(msg);
      }
    } catch {
      setSubmitError(
        import.meta.env.DEV
          ? "Could not reach /api/contact. Run `vercel dev` from the web folder, or test on the deployed site."
          : "Network error. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section
        id="contact"
        className="scroll-mt-24 border-t border-white/10 bg-black px-5 py-20 text-white md:px-10 lg:px-14 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              {contact.badge}
            </span>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">{contact.title}</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-400">{contact.intro}</p>

            <dl className="mt-10 space-y-6 text-sm">
              <div className="flex flex-col gap-1 border-b border-white/10 pb-6 md:flex-row md:justify-between">
                <dt className="font-medium text-neutral-500">Office</dt>
                <dd className="text-neutral-200">{contact.office}</dd>
              </div>
              <div className="flex flex-col gap-1 border-b border-white/10 pb-6 md:flex-row md:justify-between">
                <dt className="font-medium text-neutral-500">Email</dt>
                <dd>
                  <a href={`mailto:${contact.email}`} className="text-white underline-offset-4 hover:underline">
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-1 md:flex-row md:justify-between">
                <dt className="font-medium text-neutral-500">Telephone</dt>
                <dd>
                  <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="text-white">
                    {contact.phone}
                  </a>
                </dd>
              </div>
            </dl>

            <p className="mt-10 text-xs font-medium uppercase tracking-wider text-neutral-500">Follow us</p>
            <div className="mt-3 flex gap-4 text-white/80">
              <a href="#" className="hover:text-white" aria-label="Instagram">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white" aria-label="Social">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rounded-3xl bg-white p-6 text-neutral-900 shadow-2xl md:p-10"
          >
            {sent ? (
              <p className="py-12 text-center text-lg text-neutral-600">
                Thank you — we received your message and will reply shortly.
              </p>
            ) : (
              <form className="relative flex flex-col gap-5" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  className="pointer-events-none absolute left-0 top-0 h-0 w-0 opacity-0"
                  aria-hidden
                />
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor="fn">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fn"
                    name="name"
                    required
                    autoComplete="name"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none ring-black/0 transition focus:ring-2 focus:ring-black"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor="em">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="em"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor="ph">
                    Phone
                  </label>
                  <input
                    id="ph"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                    placeholder="(555) 000-0000"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor="msg">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="msg"
                    name="message"
                    required
                    rows={4}
                    className="w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                    placeholder="Tell us about your project…"
                  />
                  <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                    Optional: attach photos of the space (JPG, PNG, WebP, HEIC)—sent by email from our server via SMTP.
                  </p>
                </div>
                <div>
                  <span className="mb-2 block text-sm font-medium" id="photos-label">
                    Attach photos
                  </span>
                  <div
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-4"
                    role="group"
                    aria-labelledby="photos-label"
                  >
                    <input
                      ref={fileInputRef}
                      id="photos"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                      multiple
                      className="sr-only"
                      onChange={handlePhotosChange}
                      aria-describedby="photos-hint"
                    />
                    <label
                      htmlFor="photos"
                      className="cursor-pointer rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                    >
                      Choose files
                    </label>
                    <span className="text-sm text-neutral-600" aria-live="polite">
                      {photos.length === 0
                        ? "No file selected"
                        : `${photos.length} file${photos.length === 1 ? "" : "s"} selected`}
                    </span>
                  </div>
                  <p id="photos-hint" className="mt-1.5 text-xs text-neutral-500">
                    Up to {MAX_PHOTOS} images · max {MAX_BYTES / (1024 * 1024)} MB each
                  </p>
                  {photoError && (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                      {photoError}
                    </p>
                  )}
                  {photos.length > 0 && !photoError && (
                    <ul className="mt-3 space-y-1.5 rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-700">
                      {photos.map((f) => (
                        <li key={f.name + f.size} className="flex justify-between gap-2">
                          <span className="truncate">{f.name}</span>
                          <span className="shrink-0 text-neutral-500">{(f.size / 1024).toFixed(0)} KB</span>
                        </li>
                      ))}
                      <li>
                        <button
                          type="button"
                          onClick={clearPhotos}
                          className="mt-1 text-xs font-medium text-neutral-600 underline underline-offset-2 hover:text-black"
                        >
                          Clear all
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
                {submitError && (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                    {submitError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full rounded-xl bg-neutral-900 py-4 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send message"}
                </button>
                <p className="text-center text-xs text-neutral-500">
                  Submissions go to {contact.email} via our secure mail server (SMTP).
                  {import.meta.env.DEV ? (
                    <>
                      {" "}
                      Plain <code className="rounded bg-neutral-100 px-1 py-0.5 text-[0.7rem]">npm run dev</code> has no
                      API — use <code className="rounded bg-neutral-100 px-1 py-0.5 text-[0.7rem]">vercel dev</code> or
                      the live site to test.
                    </>
                  ) : null}
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-5 py-12 text-white md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <p className="text-2xl font-semibold tracking-tight">{brand.name}</p>
          <div>
            <p className="text-sm font-medium text-neutral-500">Quick links</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-neutral-300">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-[1400px] text-center text-xs text-neutral-600">
          © {new Date().getFullYear()} {brand.name}. All rights reserved.
        </p>
      </footer>
    </>
  );
}
