import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
import formidable from "formidable";
import type { File as FormidableFile } from "formidable";
import fs from "node:fs/promises";

function firstField(fields: formidable.Fields, key: string): string {
  const v = fields[key];
  if (v === undefined) return "";
  const s = Array.isArray(v) ? v[0] : v;
  return typeof s === "string" ? s.trim() : "";
}

function normalizeFiles(files: formidable.Files, key: string): FormidableFile[] {
  const raw = files[key];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

/** Comma-separated addresses from env (optional BCC). */
function parseAddressList(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER?.trim();
  /** Gmail app passwords are 16 chars; spaces are ignored — strip so copy/paste from Google always works. */
  const pass = (process.env.SMTP_PASS ?? "").trim().replace(/\s+/g, "");
  const to = process.env.CONTACT_TO_EMAIL?.trim();

  const missing: string[] = [];
  if (!host) missing.push("SMTP_HOST");
  if (!user) missing.push("SMTP_USER");
  if (!pass) missing.push("SMTP_PASS");
  if (!to) missing.push("CONTACT_TO_EMAIL");

  if (missing.length > 0) {
    console.error("contact: missing env:", missing.join(", "));
    res.status(503).json({
      ok: false,
      error:
        "SMTP is not configured. In Vercel: Project → Settings → Environment Variables — add the missing names below for Production, then redeploy.",
      missing,
    });
    return;
  }

  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  const form = formidable({
    multiples: true,
    maxFileSize: 5 * 1024 * 1024,
    maxTotalFileSize: 25 * 1024 * 1024,
    maxFiles: 5,
    filter: ({ mimetype }) => Boolean(mimetype?.startsWith("image/")),
  });

  let fields: formidable.Fields;
  let files: formidable.Files;
  try {
    [fields, files] = await form.parse(req);
  } catch (e) {
    console.error("formidable:", e);
    res.status(400).json({ ok: false, error: "Could not read form data." });
    return;
  }

  const hp = firstField(fields, "_hp");
  if (hp !== "") {
    res.status(200).json({ ok: true });
    return;
  }

  const name = firstField(fields, "name");
  const email = firstField(fields, "email");
  const phone = firstField(fields, "phone");
  const message = firstField(fields, "message");

  if (!name || !email || !message) {
    res.status(400).json({ ok: false, error: "Name, email, and message are required." });
    return;
  }

  const uploaded = normalizeFiles(files, "attachment");
  const attachments = await Promise.all(
    uploaded.map(async (f) => {
      const buf = await fs.readFile(f.filepath);
      return {
        filename: f.originalFilename?.replace(/[^\w.\- ]+/g, "_") || "attachment",
        content: buf,
        contentType: f.mimetype || "application/octet-stream",
      };
    }),
  );

  for (const f of uploaded) {
    try {
      await fs.unlink(f.filepath);
    } catch {
      /* ignore */
    }
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "—"}`,
    "",
    message,
  ].join("\n");

  const html = `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
<p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
<hr />
<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`;

  const bcc = parseAddressList(process.env.CONTACT_BCC_EMAIL);
  /** Vercel/serverless often has a random hostname; EHLO must look like a real FQDN or some providers drop mail. */
  const clientName = process.env.SMTP_CLIENT_NAME?.trim() || "elknovations.vercel.app";

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      name: clientName,
      auth: { user, pass },
      requireTLS: !secure && port === 587,
      tls: { minVersion: "TLSv1.2" },
      connectionTimeout: 25_000,
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM ?? `"Elk Novations site" <${user}>`,
      to,
      bcc: bcc.length ? bcc : undefined,
      replyTo: email,
      subject: `Elk Novations — contact from ${name}`,
      text,
      html,
      attachments: attachments.length ? attachments : undefined,
    });

    const sameMailbox = user!.toLowerCase() === to!.toLowerCase();
    console.info("contact: sent", {
      messageId: info.messageId,
      to,
      sameMailbox,
      bccCount: bcc.length,
    });

    res.status(200).json({
      ok: true,
      messageId: info.messageId,
      sameMailbox,
    });
  } catch (e) {
    console.error("nodemailer:", e);
    res.status(500).json({
      ok: false,
      error: smtpFriendlyError(e),
    });
  }
}

function smtpFriendlyError(e: unknown): string {
  const raw = e instanceof Error ? e.message : String(e);
  const m = raw.toLowerCase();
  if (m.includes("invalid login") || m.includes("authentication") || m.includes("eauth") || m.includes("535")) {
    return "SMTP rejected login. Use a Gmail App Password (16 characters) for SMTP_PASS, and ensure SMTP_USER is the full Gmail address.";
  }
  if (m.includes("timeout") || m.includes("etimedout") || m.includes("econnrefused") || m.includes("enotfound")) {
    return "Could not reach the mail server. Check SMTP_HOST / SMTP_PORT and redeploy.";
  }
  if (m.includes("message size") || m.includes("too large")) {
    return "Attachment too large for the mail server. Try smaller images.";
  }
  return "Could not send email. Open Vercel → Deployment → Functions → Logs for /api/contact for details.";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
