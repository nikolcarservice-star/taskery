import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendUserTelegramMessage } from "@/lib/telegram/user-bot";
import type { TelegramUpdate } from "@/lib/telegram/types";
import { verifyTelegramWebhookSecret } from "@/lib/telegram/webhook-utils";

export async function POST(request: NextRequest) {
  if (!verifyTelegramWebhookSecret(request, "TELEGRAM_WEBHOOK_SECRET")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const update = (await request.json()) as TelegramUpdate;
  const message = update.message;
  const text = message?.text?.trim();
  const chatId = message?.chat.id;

  if (!text || chatId == null) {
    return NextResponse.json({ ok: true });
  }

  if (text.startsWith("/start")) {
    const token = text.slice("/start".length).trim();

    if (!token) {
      await sendUserTelegramMessage(
        String(chatId),
        "Откройте ссылку подключения в настройках Taskery.",
      );
      return NextResponse.json({ ok: true });
    }

    const settings = await prisma.userSettings.findFirst({
      where: {
        telegramLinkToken: token,
        telegramLinkExpiresAt: { gt: new Date() },
      },
      select: { userId: true },
    });

    if (!settings) {
      await sendUserTelegramMessage(
        String(chatId),
        "Ссылка устарела или недействительна. Создайте новую в настройках Taskery.",
      );
      return NextResponse.json({ ok: true });
    }

    await prisma.userSettings.update({
      where: { userId: settings.userId },
      data: {
        telegramChatId: String(chatId),
        telegramMessages: true,
        telegramNotifications: true,
        telegramLinkToken: null,
        telegramLinkExpiresAt: null,
      },
    });

    await sendUserTelegramMessage(
      String(chatId),
      "Telegram подключён к Taskery. Вы будете получать уведомления о сообщениях и сделках.",
    );
  }

  return NextResponse.json({ ok: true });
}
