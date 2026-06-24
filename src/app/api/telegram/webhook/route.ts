import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

type TelegramUpdate = {
  message?: {
    chat: { id: number };
    text?: string;
  };
};

export async function POST(request: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (secret) {
    const header = request.headers.get("x-telegram-bot-api-secret-token");
    if (header !== secret) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
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
      await sendTelegramMessage(
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
      await sendTelegramMessage(
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

    await sendTelegramMessage(
      String(chatId),
      "Telegram подключён к Taskery. Вы будете получать уведомления о сообщениях и сделках.",
    );
  }

  return NextResponse.json({ ok: true });
}
