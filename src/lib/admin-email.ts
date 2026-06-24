import { siteConfig } from "@/lib/seo";
import { sendEmail } from "@/lib/email";

export async function sendAdminAlertEmail({
  to,
  subject,
  body,
  link,
}: {
  to: string;
  subject: string;
  body: string;
  link: string;
}) {
  const url = link.startsWith("http") ? link : `${siteConfig.url}${link}`;
  return sendEmail({
    to,
    subject: `[${siteConfig.name} Admin] ${subject}`,
    html: `
      <h2>${subject}</h2>
      <p>${body}</p>
      <p><a href="${url}">Открыть в админ-панели</a></p>
    `,
  });
}
