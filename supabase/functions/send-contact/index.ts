const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse(405, { success: false, message: "Method not allowed." });
  }

  const apiKey = (Deno.env.get("RESEND_API_KEY") ?? "").trim();
  const toEmail = (Deno.env.get("CONTACT_TO_EMAIL") ?? "").trim();
  const fromEmail = (Deno.env.get("CONTACT_FROM_EMAIL") ?? "onboarding@resend.dev").trim();

  if (!apiKey || !toEmail) {
    return jsonResponse(500, {
      success: false,
      message: "Server is not configured. Missing RESEND_API_KEY or CONTACT_TO_EMAIL.",
    });
  }

  try {
    const formData = await req.formData();

    if (String(formData.get("botcheck") ?? "").trim()) {
      return jsonResponse(200, { success: true });
    }

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      return jsonResponse(400, { success: false, message: "Name, email, and message are required." });
    }

    const files = formData.getAll("attachments").filter((item): item is File => item instanceof File && item.size > 0);
    if (files.length > MAX_ATTACHMENTS) {
      return jsonResponse(400, {
        success: false,
        message: `Please attach up to ${MAX_ATTACHMENTS} files only.`,
      });
    }

    const attachments: Array<{ filename: string; content: string }> = [];
    for (const file of files) {
      if (file.size > MAX_ATTACHMENT_BYTES) {
        return jsonResponse(400, {
          success: false,
          message: `File "${file.name}" is too large. Max size is 10MB per file.`,
        });
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: toBase64(bytes),
      });
    }

    const payload: Record<string, unknown> = {
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `Elk Novations contact form: ${name}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "-")}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br/>")}</p>
      `,
    };
    if (attachments.length > 0) {
      payload.attachments = attachments;
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      return jsonResponse(502, {
        success: false,
        message: `Resend rejected the email: ${errorText || "unknown error"}`,
      });
    }

    return jsonResponse(200, { success: true });
  } catch {
    return jsonResponse(500, {
      success: false,
      message: "Unexpected server error. Please try again.",
    });
  }
});
