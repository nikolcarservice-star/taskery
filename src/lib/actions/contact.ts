"use server";

import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/html-escape";
import { checkRateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/seo";

export type ContactState = { error?: string; success?: boolean };

export async function submitContactForm(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = (formData.get("name") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim();
  const message = (formData.get("message") as string | null)?.trim();

  if (!name || !email || !message) {
    return { error: "CONTACT_ALL_FIELDS" };
  }

  if (message.length < 10) {
    return { error: "CONTACT_MESSAGE_TOO_SHORT" };
  }

  if (message.length > 5000) {
    return { error: "CONTACT_MESSAGE_TOO_LONG" };
  }

  const limited = checkRateLimit(`contact:${email.toLowerCase()}`, 3, 60_000);
  if (!limited.ok) {
    return { error: "RATE_LIMIT_EXCEEDED" };
  }

  await sendEmail({
    to: siteConfig.emails.support,
    subject: `Обратная связь: ${name}`,
    html: `
      <p><strong>Имя:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Сообщение:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });

  return { success: true };
}
