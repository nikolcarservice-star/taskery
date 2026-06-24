import { siteConfig } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export function telegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim());
}

export function getTelegramBotUsername(): string | null {
  const username = process.env.TELEGRAM_BOT_USERNAME?.trim();
  return username || null;
}

export async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return false;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  return response.ok;
}

export async function sendTelegramToUser(
  userId: string,
  title: string,
  body: string,
  link?: string,
) {
  if (!telegramConfigured()) return;

  const settings = await prisma.userSettings.findUnique({
    where: { userId },
    select: { telegramChatId: true, telegramMessages: true },
  });

  if (!settings?.telegramChatId || !settings.telegramMessages) return;

  const url = link
    ? link.startsWith("http")
      ? link
      : `${siteConfig.url}${link}`
    : `${siteConfig.url}/notifications`;

  const text = `${title}\n${body}\n\n${url}`;

  try {
    await sendTelegramMessage(settings.telegramChatId, text);
  } catch (error) {
    console.error("[telegram]", userId, error);
  }
}
