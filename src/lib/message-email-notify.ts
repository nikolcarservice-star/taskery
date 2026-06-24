import { sendEmail, emailEnabled } from "@/lib/email";
import { fillEmailTemplate, getEmailTemplates } from "@/lib/email-i18n";
import { getEmailLocaleForUser } from "@/lib/i18n/user-locale";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteConfig } from "@/lib/seo";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

type MessageEmailKind = "conversation" | "bid";

type MessageEmailParams = {
  recipientId: string;
  kind: MessageEmailKind;
  senderName: string;
  projectTitle: string;
  preview: string;
  link: string;
};

export async function maybeSendMessageNotificationEmail({
  recipientId,
  kind,
  senderName,
  projectTitle,
  preview,
  link,
}: MessageEmailParams): Promise<void> {
  if (!emailEnabled) return;

  const recipient = await prisma.user.findUnique({
    where: { id: recipientId },
    select: {
      email: true,
      deletedAt: true,
      settings: { select: { emailNewMessages: true } },
    },
  });

  if (!recipient?.email || recipient.deletedAt) return;
  if (!recipient.settings?.emailNewMessages) return;

  const locale = await getEmailLocaleForUser(recipientId);
  const t = getEmailTemplates(locale);
  const vars = {
    siteName: siteConfig.name,
    senderName: escapeHtml(senderName),
    projectTitle: escapeHtml(projectTitle),
  };
  const url = absoluteUrl(link);
  const safePreview = escapeHtml(preview.slice(0, 500));
  const subjectTemplate =
    kind === "bid" ? t.bidMessageSubject : t.messageSubject;

  try {
    await sendEmail({
      to: recipient.email,
      subject: fillEmailTemplate(subjectTemplate, vars),
      html: `
        <p>${fillEmailTemplate(t.messageBody, vars)}</p>
        <blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid #e4e4e7;color:#3f3f46">${safePreview}</blockquote>
        <p><a href="${url}">${fillEmailTemplate(t.messageCta, vars)}</a></p>
        <p style="color:#71717a;font-size:12px">${fillEmailTemplate(t.messageFooter, vars)}</p>
      `,
    });
  } catch (error) {
    console.error("[message-email]", recipientId, error);
  }
}

export async function maybeSendProjectMatchEmail({
  recipientId,
  projectTitle,
  categoryName,
  link,
}: {
  recipientId: string;
  projectTitle: string;
  categoryName: string;
  link: string;
}): Promise<void> {
  if (!emailEnabled) return;

  const recipient = await prisma.user.findUnique({
    where: { id: recipientId },
    select: {
      email: true,
      deletedAt: true,
      settings: { select: { emailProjectDigest: true } },
    },
  });

  if (!recipient?.email || recipient.deletedAt) return;
  if (!recipient.settings?.emailProjectDigest) return;

  const locale = await getEmailLocaleForUser(recipientId);
  const t = getEmailTemplates(locale);
  const vars = {
    siteName: siteConfig.name,
    projectTitle: escapeHtml(projectTitle),
    categoryName: escapeHtml(categoryName),
  };
  const url = absoluteUrl(link);

  try {
    await sendEmail({
      to: recipient.email,
      subject: fillEmailTemplate(t.projectMatchSubject, vars),
      html: `
        <p>${fillEmailTemplate(t.projectMatchBody, vars)}</p>
        <p><a href="${url}">${fillEmailTemplate(t.projectMatchCta, vars)}</a></p>
        <p style="color:#71717a;font-size:12px">${fillEmailTemplate(t.projectMatchFooter, vars)}</p>
      `,
    });
  } catch (error) {
    console.error("[project-match-email]", recipientId, error);
  }
}
