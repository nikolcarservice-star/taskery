import { Resend } from "resend";
import { siteConfig } from "@/lib/seo";

export const emailEnabled = Boolean(process.env.RESEND_API_KEY);

const resend = emailEnabled
  ? new Resend(process.env.RESEND_API_KEY!)
  : null;

const from = process.env.EMAIL_FROM ?? siteConfig.emails.noreply;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.log("[email:dev]", { to, subject });
    return { ok: true as const };
  }

  await resend.emails.send({ from, to, subject, html });
  return { ok: true as const };
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  return sendEmail({
    to,
    subject: `Сброс пароля — ${siteConfig.name}`,
    html: `
      <h2>Сброс пароля</h2>
      <p>Вы запросили сброс пароля на ${siteConfig.name}.</p>
      <p><a href="${resetUrl}">Нажмите здесь, чтобы задать новый пароль</a></p>
      <p>Ссылка действительна 1 час. Если вы не запрашивали сброс — проигнорируйте письмо.</p>
    `,
  });
}

export async function sendWelcomeEmail(to: string, name: string | null) {
  return sendEmail({
    to,
    subject: `Добро пожаловать в ${siteConfig.name}!`,
    html: `
      <h2>Добро пожаловать${name ? `, ${name}` : ""}!</h2>
      <p>Ваш аккаунт на ${siteConfig.name} успешно создан.</p>
      <p><a href="${siteConfig.url}">Перейти на платформу</a></p>
    `,
  });
}

export async function sendBidNotificationEmail(
  to: string,
  projectTitle: string,
  projectUrl: string,
) {
  return sendEmail({
    to,
    subject: `Новый отклик на проект «${projectTitle}»`,
    html: `
      <p>На ваш проект «${projectTitle}» поступил новый отклик.</p>
      <p><a href="${projectUrl}">Посмотреть отклики</a></p>
    `,
  });
}
