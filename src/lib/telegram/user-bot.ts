import type { NotificationType } from "@/generated/prisma/client";
import { shouldSendTelegramForType } from "@/lib/notification-channels";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/seo";
import type { TelegramSendOptions } from "@/lib/telegram/types";

export function userTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim());
}

export function getUserTelegramBotUsername(): string | null {
  const username = process.env.TELEGRAM_BOT_USERNAME?.trim();
  return username || null;
}

export async function sendUserTelegramMessage(
  chatId: string,
  text: string,
  options?: TelegramSendOptions,
) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return false;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
      parse_mode: options?.parseMode,
      reply_markup: options?.replyMarkup,
    }),
  });

  return response.ok;
}

export async function sendUserTelegramToUser(
  userId: string,
  title: string,
  body: string,
  link?: string,
  type: NotificationType = "USER_WARNING",
) {
  if (!userTelegramConfigured()) return;

  const settings = await prisma.userSettings.findUnique({
    where: { userId },
    select: {
      telegramChatId: true,
      telegramMessages: true,
      telegramNotifications: true,
    },
  });

  if (!settings?.telegramChatId) return;

  if (
    !shouldSendTelegramForType(type, {
      telegramMessages: settings.telegramMessages,
      telegramNotifications: settings.telegramNotifications,
    })
  ) {
    return;
  }

  const url = link
    ? link.startsWith("http")
      ? link
      : `${siteConfig.url}${link}`
    : `${siteConfig.url}/notifications`;

  const text = `${title}\n${body}\n\n${url}`;

  try {
    await sendUserTelegramMessage(settings.telegramChatId, text);
  } catch (error) {
    console.error("[telegram:user]", userId, error);
  }
}
