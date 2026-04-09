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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!host || !user || !pass || !to) {
    console.error("contact: missing SMTP env (SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL)");
    res.status(503).json({
      ok: false,
      error: "Email is not configured on the server. Set SMTP variables in the host dashboard.",
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

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? `"Elk Novations site" <${user}>`,
      to,
      replyTo: email,
      subject: `Elk Novations — contact from ${name}`,
      text,
      html,
      attachments: attachments.length ? attachments : undefined,
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("nodemailer:", e);
    res.status(500).json({ ok: false, error: "Could not send email. Try again later." });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
