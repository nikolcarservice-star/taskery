import type { AdminPermission, NotificationType } from "@/generated/prisma/client";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getEmailLocaleForUser } from "@/lib/i18n/user-locale";
import {
  buildNotification,
  type NotificationTemplateKey,
} from "@/lib/notification-i18n";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/seo";
import type { TelegramInlineButton, TelegramSendOptions } from "@/lib/telegram/types";
import {
  adminTelegramAlertScopeForTemplate,
  recordAdminTelegramAlert,
} from "@/lib/telegram/admin-alerts";

export function adminTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_ADMIN_BOT_TOKEN?.trim());
}

export function getAdminTelegramBotUsername(): string | null {
  const username = process.env.TELEGRAM_ADMIN_BOT_USERNAME?.trim();
  return username || null;
}

export function getAdminTelegramAllowedUserIds(): Set<string> {
  const raw = process.env.TELEGRAM_ADMIN_ALLOWED_USER_IDS?.trim();
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );
}

export function isTelegramUserAllowedForAdminBot(telegramUserId: string | number) {
  const allowed = getAdminTelegramAllowedUserIds();
  if (allowed.size === 0) return true;
  return allowed.has(String(telegramUserId));
}

export async function sendAdminTelegramMessage(
  chatId: string,
  text: string,
  options?: TelegramSendOptions,
): Promise<number | null> {
  const token = process.env.TELEGRAM_ADMIN_BOT_TOKEN?.trim();
  if (!token) return null;

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
        parse_mode: options?.parseMode,
        reply_markup: options?.replyMarkup,
      }),
    },
  );

  if (!response.ok) return null;

  try {
    const data = (await response.json()) as {
      ok?: boolean;
      result?: { message_id?: number };
    };
    return data.ok ? (data.result?.message_id ?? null) : null;
  } catch {
    return null;
  }
}

export async function answerAdminTelegramCallback(
  callbackQueryId: string,
  text?: string,
) {
  const token = process.env.TELEGRAM_ADMIN_BOT_TOKEN?.trim();
  if (!token) return false;

  const response = await fetch(
    `https://api.telegram.org/bot${token}/answerCallbackQuery`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: Boolean(text),
      }),
    },
  );

  return response.ok;
}

export async function deleteAdminTelegramMessage(
  chatId: string | number,
  messageId: number,
) {
  const token = process.env.TELEGRAM_ADMIN_BOT_TOKEN?.trim();
  if (!token) return false;

  const response = await fetch(
    `https://api.telegram.org/bot${token}/deleteMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
      }),
    },
  );

  return response.ok;
}

export async function editAdminTelegramMessage(
  chatId: string | number,
  messageId: number,
  text: string,
  options?: TelegramSendOptions,
) {
  const token = process.env.TELEGRAM_ADMIN_BOT_TOKEN?.trim();
  if (!token) return false;

  const response = await fetch(
    `https://api.telegram.org/bot${token}/editMessageText`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        disable_web_page_preview: true,
        parse_mode: options?.parseMode,
        reply_markup: options?.replyMarkup,
      }),
    },
  );

  return response.ok;
}

function absoluteAdminLink(link: string) {
  return link.startsWith("http") ? link : `${siteConfig.url}${link}`;
}

export function buildAdminTelegramKeyboard(
  template: NotificationTemplateKey,
  link: string,
  metadata?: Record<string, string>,
): TelegramInlineButton[][] {
  const rows: TelegramInlineButton[][] = [];
  const openUrl = absoluteAdminLink(link);

  if (template === "ADMIN_PROJECT_PENDING" && metadata?.projectId) {
    rows.push([
      {
        text: "✅ Одобрить",
        callback_data: `pa:${metadata.projectId}`,
      },
      {
        text: "❌ Отклонить",
        callback_data: `pr:${metadata.projectId}`,
      },
    ]);
  }

  if (template === "ADMIN_PROJECT_PENDING" && metadata?.projectSlug) {
    rows.push([
      {
        text: "📋 Открыть проект",
        url: absoluteAdminLink(`/projects/${metadata.projectSlug}`),
      },
    ]);
  }

  if (template === "ADMIN_WITHDRAWAL_REQUEST" && metadata?.paymentId) {
    rows.push([
      {
        text: "✅ Одобрить вывод",
        callback_data: `wa:${metadata.paymentId}`,
      },
      {
        text: "❌ Отклонить",
        callback_data: `wr:${metadata.paymentId}`,
      },
    ]);
  }

  rows.push([
    {
      text:
        template === "ADMIN_PROJECT_PENDING"
          ? "🌐 Модерация"
          : "🌐 Открыть в админке",
      url: openUrl,
    },
  ]);

  return rows;
}

export async function sendAdminTelegramToUser(
  userId: string,
  adminPermissions: AdminPermission[],
  payload: {
    template: NotificationTemplateKey;
    variables?: Record<string, string>;
    link: string;
    metadata?: Record<string, string>;
    requiredPermission: AdminPermission;
  },
) {
  if (!adminTelegramConfigured()) return;
  if (!hasAdminPermission(adminPermissions, payload.requiredPermission)) return;

  const settings = await prisma.userSettings.findUnique({
    where: { userId },
    select: {
      adminTelegramChatId: true,
      adminTelegramAlerts: true,
    },
  });

  if (!settings?.adminTelegramChatId || !settings.adminTelegramAlerts) return;

  const locale = await getEmailLocaleForUser(userId);
  const { title, body } = buildNotification(
    locale,
    payload.template,
    payload.variables ?? {},
  );

  const keyboard = buildAdminTelegramKeyboard(
    payload.template,
    payload.template === "ADMIN_PROJECT_PENDING"
      ? "/admin/moderation"
      : payload.link,
    payload.metadata,
  );

  let text = `🔔 ${title}\n${body}`;
  if (payload.metadata?.projectSlug) {
    text += `\n\n${absoluteAdminLink(`/projects/${payload.metadata.projectSlug}`)}`;
  }

  try {
    const messageId = await sendAdminTelegramMessage(
      settings.adminTelegramChatId,
      text,
      {
        replyMarkup: { inline_keyboard: keyboard },
      },
    );

    const alertTarget = adminTelegramAlertScopeForTemplate(
      payload.template,
      payload.metadata,
    );
    if (messageId != null && alertTarget) {
      await recordAdminTelegramAlert(
        alertTarget.scope,
        alertTarget.targetId,
        settings.adminTelegramChatId,
        messageId,
      );
    }
  } catch (error) {
    console.error("[telegram:admin]", userId, error);
  }
}

/** Maps admin notification types to required permission for delivery. */
export function adminPermissionForNotificationType(
  type: NotificationType,
): AdminPermission {
  switch (type) {
    case "ADMIN_WITHDRAWAL":
      return "FINANCE";
    default:
      return "MODERATION";
  }
}
