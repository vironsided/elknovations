import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { footerLinks } from "../data/site";
import { useBrand, useContact, useSocialLinks } from "../hooks/useSiteData";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const CONTACT_ENDPOINT = String(import.meta.env.VITE_CONTACT_ENDPOINT ?? "").trim();
const CONTACT_USE_RESEND = Boolean(CONTACT_ENDPOINT);
const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const ATTACHMENTS_HINT = "Up to 3 files, max 10MB each (images, PDF, DOC, DOCX).";

function getAccessKey(): string {
  return String(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? "").trim();
}

function missingKeyHelp(): string {
  if (import.meta.env.PROD) {
    return "The live site needs VITE_WEB3FORMS_ACCESS_KEY in your host (Vercel / Netlify) → Environment variables → save → redeploy. Vite reads it at build time.";
  }
  return "Add VITE_WEB3FORMS_ACCESS_KEY to a `.env` file in the `web` folder (free key from web3forms.com — use the inbox that should receive leads).";
}

const socialIcons: Record<string, ReactNode> = {
  instagram: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  x: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  twitter: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  facebook: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.07 1.374.14v3.32a8 8 0 0 0-.732-.029c-1.04 0-1.441.394-1.441 1.418v2.71h3.467l-.595 3.666h-2.872v8.118C19.396 23.07 23 18.963 23 14.09c0-5.545-4.455-10.04-9.95-10.04C7.556 4.05 3.1 8.545 3.1 14.09c0 4.508 3.125 8.282 7.321 9.295z" />
    </svg>
  ),
  linkedin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  youtube: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  tiktok: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  pinterest: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" />
    </svg>
  ),
  whatsapp: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  ),
  telegram: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  snapchat: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.949-.263.175-.088.369-.133.541-.133.316 0 .597.124.838.315.192.159.301.39.301.654 0 .483-.448.883-1.334 1.187-.343.116-.793.252-1.104.347-.44.131-.626.198-.768.387-.13.172-.105.387-.075.581.002.015.006.03.009.045.05.272.054.471.051.554a.773.773 0 0 1-.093.323c-.19.382-.581.597-1.164.637-.452.032-.9-.052-1.327-.134-.188-.035-.386-.074-.576-.106a2.448 2.448 0 0 0-.432-.045c-.2 0-.395.044-.575.115-.497.203-.982.678-1.442 1.114-.473.452-.916.786-1.378.996-.428.194-.888.294-1.348.294-.06 0-.119-.002-.179-.005-.04-.002-.08-.003-.119-.003-.478 0-.937-.1-1.35-.29-.467-.213-.914-.549-1.387-1.002-.455-.434-.938-.91-1.441-1.115a2.35 2.35 0 0 0-.576-.115 2.5 2.5 0 0 0-.433.045c-.19.032-.388.071-.574.106-.262.05-.549.102-.847.131a3.21 3.21 0 0 1-.487.004c-.56-.038-.944-.254-1.136-.64a.774.774 0 0 1-.084-.318 3.21 3.21 0 0 1 .048-.544l.012-.062c.029-.192.055-.405-.075-.576-.143-.19-.328-.256-.769-.387-.31-.095-.761-.231-1.104-.347-.883-.303-1.333-.702-1.333-1.186 0-.28.123-.514.324-.667.241-.191.52-.315.836-.315.174 0 .367.045.54.133.291.143.649.267.95.263.197 0 .325-.045.4-.09a9.062 9.062 0 0 1-.03-.51l-.003-.06c-.104-1.627-.23-3.653.3-4.847C5.852 1.069 9.21.793 10.2.793h2.006z" />
    </svg>
  ),
  threads: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.33-3.022.88-.727 2.1-1.138 3.546-1.192 1.04-.04 2 .043 2.87.252-.063-1.203-.507-2.134-1.292-2.707-.664-.484-1.56-.733-2.663-.74h-.03c-.876 0-1.98.248-2.715 1.002l-1.47-1.412c1.036-1.06 2.477-1.62 4.17-1.62h.04c1.454.012 2.675.393 3.627 1.133 1.001.778 1.625 1.89 1.855 3.302.487.165.94.374 1.356.628 1.117.684 1.95 1.618 2.407 2.696.787 1.854.82 4.592-1.258 6.625-1.827 1.79-4.074 2.584-7.275 2.609z" />
    </svg>
  ),
};

export function Contact() {
  const { data: brand } = useBrand();
  const { data: contact } = useContact();
  const { data: socialLinks } = useSocialLinks();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function getAttachmentError(files: FileList | null): string | null {
    if (!files || files.length === 0) return null;
    if (files.length > MAX_ATTACHMENTS) {
      return `Please attach up to ${MAX_ATTACHMENTS} files only.`;
    }
    for (const file of Array.from(files)) {
      if (file.size > MAX_ATTACHMENT_BYTES) {
        return `File "${file.name}" is too large. Max size is 10MB per file.`;
      }
    }
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const attachmentsInput = form.elements.namedItem("attachments") as HTMLInputElement | null;
    const attachmentError = getAttachmentError(attachmentsInput?.files ?? null);
    if (attachmentError) {
      setSubmitError(attachmentError);
      setSubmitting(false);
      return;
    }

    try {
      if (CONTACT_USE_RESEND) {
        const fd = new FormData(form);
        const res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          body: fd,
        });
        const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };

        if (res.ok && data.success) {
          setSent(true);
          form.reset();
        } else {
          setSubmitError(data.message || "Could not send message right now. Please try again.");
        }
        return;
      }

      const key = getAccessKey();
      if (!key) {
        setSubmitError(missingKeyHelp());
        return;
      }

      if ((attachmentsInput?.files?.length ?? 0) > 0) {
        setSubmitError("Attachments via Web3Forms require Pro. Use Resend endpoint mode to send files for free.");
        return;
      }

      const fd = new FormData(form);
      fd.append("access_key", key);
      fd.append("subject", "Elk Novations — Website contact form");
      fd.delete("attachments");

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

            {socialLinks.length > 0 && (
              <>
                <p className="mt-10 text-xs font-medium uppercase tracking-wider text-neutral-500">Follow us</p>
                <div className="mt-3 flex gap-4 text-white/80">
                  {socialLinks.map((link) => {
                    const key = link.platform.toLowerCase();
                    const icon = socialIcons[key];
                    if (!icon || !link.url) return null;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                        aria-label={link.platform}
                      >
                        {icon}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
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
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor="attachments">
                    Attachments
                  </label>
                  <input
                    id="attachments"
                    name="attachments"
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-black"
                  />
                  <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                    {ATTACHMENTS_HINT}
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
                  {CONTACT_USE_RESEND ? (
                    <>Submissions go to {contact.email} via your secure Resend endpoint.</>
                  ) : (
                    <>
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
                    </>
                  )}
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
