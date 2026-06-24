import { sendEmail, emailEnabled } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteConfig } from "@/lib/seo";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

type MessageEmailParams = {
  recipientId: string;
  subject: string;
  senderName: string;
  projectTitle: string;
  preview: string;
  link: string;
};

export async function maybeSendMessageNotificationEmail({
  recipientId,
  subject,
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

  const url = absoluteUrl(link);
  const safeSender = escapeHtml(senderName);
  const safeTitle = escapeHtml(projectTitle);
  const safePreview = escapeHtml(preview.slice(0, 500));

  try {
    await sendEmail({
      to: recipient.email,
      subject,
      html: `
        <p><strong>${safeSender}</strong> написал вам по проекту «${safeTitle}»:</p>
        <blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid #e4e4e7;color:#3f3f46">${safePreview}</blockquote>
        <p><a href="${url}">Открыть переписку</a></p>
        <p style="color:#71717a;font-size:12px">Вы получили это письмо, потому что включили уведомления о новых сообщениях в настройках ${siteConfig.name}.</p>
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

  const url = absoluteUrl(link);
  const safeTitle = escapeHtml(projectTitle);
  const safeCategory = escapeHtml(categoryName);

  try {
    await sendEmail({
      to: recipient.email,
      subject: `Новый проект в категории «${safeCategory}»`,
      html: `
        <p>Опубликован проект «${safeTitle}» в категории «${safeCategory}».</p>
        <p><a href="${url}">Посмотреть проект</a></p>
        <p style="color:#71717a;font-size:12px">Вы получили это письмо, потому что включили дайджест новых проектов в настройках ${siteConfig.name}.</p>
      `,
    });
  } catch (error) {
    console.error("[project-match-email]", recipientId, error);
  }
}
