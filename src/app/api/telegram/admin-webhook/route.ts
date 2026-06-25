import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { handleAdminTelegramUpdate } from "@/lib/telegram/admin-handlers";
import {
  isTelegramUserAllowedForAdminBot,
  sendAdminTelegramMessage,
} from "@/lib/telegram/admin-bot";
import type { TelegramUpdate } from "@/lib/telegram/types";
import { verifyTelegramWebhookSecret } from "@/lib/telegram/webhook-utils";

export async function POST(request: NextRequest) {
  if (!verifyTelegramWebhookSecret(request, "TELEGRAM_ADMIN_WEBHOOK_SECRET")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const update = (await request.json()) as TelegramUpdate;

  const message = update.message;
  const text = message?.text?.trim();
  const chatId = message?.chat.id;
  const telegramUserId = message?.from?.id;

  if (
    text?.startsWith("/start") &&
    chatId != null &&
    telegramUserId != null
  ) {
    const token = text.slice("/start".length).trim();

    if (token) {
      if (!isTelegramUserAllowedForAdminBot(telegramUserId)) {
        await sendAdminTelegramMessage(
          String(chatId),
          "Доступ закрыт. Ваш Telegram ID не в списке разрешённых.",
        );
        return NextResponse.json({ ok: true });
      }

      const settings = await prisma.userSettings.findFirst({
        where: {
          adminTelegramLinkToken: token,
          adminTelegramLinkExpiresAt: { gt: new Date() },
        },
        select: {
          userId: true,
          user: { select: { role: true, adminActive: true } },
        },
      });

      if (!settings || settings.user.role !== "ADMIN" || !settings.user.adminActive) {
        await sendAdminTelegramMessage(
          String(chatId),
          "Ссылка недействительна или у аккаунта нет прав администратора.",
        );
        return NextResponse.json({ ok: true });
      }

      await prisma.userSettings.update({
        where: { userId: settings.userId },
        data: {
          adminTelegramChatId: String(chatId),
          adminTelegramUserId: String(telegramUserId),
          adminTelegramAlerts: true,
          adminTelegramLinkToken: null,
          adminTelegramLinkExpiresAt: null,
        },
      });

      await sendAdminTelegramMessage(
        String(chatId),
        "Админ-бот подключён. Вы будете получать уведомления модерации и финансов.\n\n/help — список команд",
      );
      return NextResponse.json({ ok: true });
    }
  }

  await handleAdminTelegramUpdate(update);

  return NextResponse.json({ ok: true });
}
