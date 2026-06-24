import { Resend } from "resend";
import { fillEmailTemplate, getEmailTemplates } from "@/lib/email-i18n";
import type { AppLocale } from "@/lib/i18n/types";
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

function siteVars(): Record<string, string> {
  return { siteName: siteConfig.name };
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  locale: AppLocale,
) {
  const t = getEmailTemplates(locale);
  const vars = { ...siteVars(), resetUrl };

  return sendEmail({
    to,
    subject: fillEmailTemplate(t.passwordResetSubject, vars),
    html: `
      <h2>${fillEmailTemplate(t.passwordResetHeading, vars)}</h2>
      <p>${fillEmailTemplate(t.passwordResetIntro, vars)}</p>
      <p><a href="${resetUrl}">${fillEmailTemplate(t.passwordResetCta, vars)}</a></p>
      <p>${fillEmailTemplate(t.passwordResetExpiry, vars)}</p>
    `,
  });
}

export async function sendWelcomeEmail(
  to: string,
  name: string | null,
  locale: AppLocale,
) {
  const t = getEmailTemplates(locale);
  const vars = siteVars();
  const heading = name
    ? fillEmailTemplate(t.welcomeHeadingNamed, { ...vars, name })
    : fillEmailTemplate(t.welcomeHeading, vars);

  return sendEmail({
    to,
    subject: fillEmailTemplate(t.welcomeSubject, vars),
    html: `
      <h2>${heading}</h2>
      <p>${fillEmailTemplate(t.welcomeIntro, vars)}</p>
      <p><a href="${siteConfig.url}">${fillEmailTemplate(t.welcomeCta, vars)}</a></p>
    `,
  });
}

export async function sendBidNotificationEmail(
  to: string,
  projectTitle: string,
  projectUrl: string,
  locale: AppLocale,
) {
  const t = getEmailTemplates(locale);
  const vars = { ...siteVars(), projectTitle, projectUrl };

  return sendEmail({
    to,
    subject: fillEmailTemplate(t.bidSubject, vars),
    html: `
      <p>${fillEmailTemplate(t.bidBody, vars)}</p>
      <p><a href="${projectUrl}">${fillEmailTemplate(t.bidCta, vars)}</a></p>
    `,
  });
}
