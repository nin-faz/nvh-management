const MAX_ATTACHMENT_SIZE = 4 * 1024 * 1024;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const json = (body: Record<string, string>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return btoa(binary);
}

export default async (request: Request) => {
  if (request.method !== "POST") {
    return json({ error: "Méthode non autorisée." }, 405);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_TO_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !recipient) {
    console.error("Missing env vars");
    return json({ error: "L'envoi d'e-mail n'est pas encore configuré." }, 503);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err) {
    console.error("FormData parse error", err);
    return json({ error: "Données invalides." }, 400);
  }

  const website = String(formData.get("website") || "").trim();
  if (website) return json({ success: "Message envoyé." });

  const subject = String(formData.get("objet") || "").trim();
  const replyTo = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const attachment = formData.get("fichier");

  if (subject.length < 2 || message.length < 5 || !/^\S+@\S+\.\S+$/.test(replyTo)) {
    return json({ error: "Certains champs sont invalides." }, 400);
  }

  const attachments: Array<{ filename: string; content: string; content_type: string }> = [];

  if (attachment instanceof Blob && attachment.size > 0) {
    if (attachment.size > MAX_ATTACHMENT_SIZE) {
      return json({ error: "La pièce jointe ne doit pas dépasser 4 Mo." }, 413);
    }
    attachments.push({
      filename: (attachment as File).name || "piece-jointe",
      content: toBase64(await attachment.arrayBuffer()),
      content_type: attachment.type || "application/octet-stream",
    });
  }

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: replyTo,
      subject: `Demande provenant du site : ${subject}`,
      text: message,
      html: `<div style="font-family:Arial,sans-serif;white-space:pre-wrap">${escapeHtml(message)}</div>`,
      attachments: attachments.length ? attachments : undefined,
    }),
  });

  if (!resendRes.ok) {
    const err = await resendRes.text();
    console.error("Resend error", resendRes.status, err);
    return json({ error: "Le message n'a pas pu être envoyé." }, 502);
  }

  return json({ success: "Votre message a bien été envoyé." });
};

export const config = { path: "/api/contact" };
