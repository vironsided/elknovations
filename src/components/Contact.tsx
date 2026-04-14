import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { footerLinks } from "../data/site";
import { useBrand, useContact } from "../hooks/useSiteData";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

function getAccessKey(): string {
  return String(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? "").trim();
}

function missingKeyHelp(): string {
  if (import.meta.env.PROD) {
    return "The live site needs VITE_WEB3FORMS_ACCESS_KEY in your host (Vercel / Netlify) → Environment variables → save → redeploy. Vite reads it at build time.";
  }
  return "Add VITE_WEB3FORMS_ACCESS_KEY to a `.env` file in the `web` folder (free key from web3forms.com — use the inbox that should receive leads).";
}

export function Contact() {
  const { data: brand } = useBrand();
  const { data: contact } = useContact();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const key = getAccessKey();
    if (!key) {
      setSubmitError(missingKeyHelp());
      return;
    }

    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.append("access_key", key);
    fd.append("subject", "Elk Novations — Website contact form");

    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };

      if (res.ok && data.success) {
        setSent(true);
        form.reset();
      } else {
        setSubmitError(data.message || "Something went wrong. Please try again or email us directly.");
      }
    } catch {
      setSubmitError("Network error. Check your connection and try again.");
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" className="hover:text-white" aria-label="X / Twitter">
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
                  type="checkbox"
                  name="botcheck"
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
                    The free Web3Forms tier sends text only — paste links to photos if needed.
                  </p>
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
                  Submissions go to {contact.email} via{" "}
                  <a
                    href="https://web3forms.com"
                    className="underline underline-offset-2 hover:text-neutral-800"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Web3Forms
                  </a>
                  .
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
