const MAX_ATTACHMENT_SIZE = 4 * 1024 * 1024;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const jsonResponse = (body: Record<string, string>, status = 200) =>
  Response.json(body, { status });

export default async (request: Request) => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Méthode non autorisée." }, 405);
  }

  const apiKey = Netlify.env.get("RESEND_API_KEY");
  const recipient = Netlify.env.get("CONTACT_TO_EMAIL");
  const sender =
    Netlify.env.get("RESEND_FROM_EMAIL") ||
    "N.V.H Management <onboarding@resend.dev>";

  if (!apiKey || !recipient) {
    console.error("RESEND_API_KEY or CONTACT_TO_EMAIL is missing");
    return jsonResponse(
      { error: "L'envoi d'e-mail n'est pas encore configuré." },
      503,
    );
  }

  const formData = await request.formData();
  const website = String(formData.get("website") || "").trim();

  if (website) {
    return jsonResponse({ success: "Message envoyé." });
  }

  const subject = String(formData.get("objet") || "").trim();
  const replyTo = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const attachment = formData.get("fichier");

  if (
    subject.length < 2 ||
    message.length < 5 ||
    !/^\S+@\S+\.\S+$/.test(replyTo)
  ) {
    return jsonResponse({ error: "Certains champs sont invalides." }, 400);
  }

  const attachments: Array<{ filename: string; content: string }> = [];

  if (attachment instanceof File && attachment.size > 0) {
    if (attachment.size > MAX_ATTACHMENT_SIZE) {
      return jsonResponse(
        { error: "La pièce jointe ne doit pas dépasser 4 Mo." },
        413,
      );
    }
    attachments.push({
      filename: attachment.name || "piece-jointe",
      content: Buffer.from(await attachment.arrayBuffer()).toString("base64"),
    });
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
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

  if (!resendResponse.ok) {
    console.error("Resend request failed", resendResponse.status);
    return jsonResponse({ error: "Le message n'a pas pu être envoyé." }, 502);
  }

  return jsonResponse({ success: "Votre message a bien été envoyé." });
};

export const config = {
  path: "/api/contact",
};
