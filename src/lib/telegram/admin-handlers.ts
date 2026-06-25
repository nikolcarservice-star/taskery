import {
  answerAdminTelegramCallback,
  editAdminTelegramMessage,
  sendAdminTelegramMessage,
} from "@/lib/telegram/admin-bot";
import {
  buildAdminActionDoneMenu,
  buildAdminMainMenu,
  resolveAdminMenuScreen,
} from "@/lib/telegram/admin-menu";
import {
  telegramApproveProject,
  telegramApproveWithdrawal,
  telegramHelpText,
  telegramRejectProject,
  telegramRejectWithdrawal,
  telegramToggleAdminAlerts,
} from "@/lib/telegram/admin-ops";
import {
  resolveAdminByTelegramChat,
  type ResolvedAdmin,
} from "@/lib/telegram/resolve";
import type { TelegramUpdate } from "@/lib/telegram/types";

const MENU_PARSE_MODE = "HTML" as const;

async function sendAdminMenu(
  chatId: number,
  admin: ResolvedAdmin,
  target = "main",
) {
  const screen = await resolveAdminMenuScreen(admin, target);
  if ("error" in screen) {
    await sendAdminTelegramMessage(String(chatId), screen.error);
    return;
  }

  await sendAdminTelegramMessage(String(chatId), screen.text, {
    parseMode: MENU_PARSE_MODE,
    replyMarkup: { inline_keyboard: screen.keyboard },
  });
}

async function editAdminMenu(
  chatId: number,
  messageId: number,
  admin: ResolvedAdmin,
  target: string,
) {
  const screen = await resolveAdminMenuScreen(admin, target);
  if ("error" in screen) {
    return false;
  }

  return editAdminTelegramMessage(chatId, messageId, screen.text, {
    parseMode: MENU_PARSE_MODE,
    replyMarkup: { inline_keyboard: screen.keyboard },
  });
}

async function handleAdminCommand(
  chatId: number,
  telegramUserId: number,
  text: string,
) {
  const admin = await resolveAdminByTelegramChat(chatId, telegramUserId);
  if (!admin) {
    await sendAdminTelegramMessage(
      String(chatId),
      "Доступ закрыт. Подключите бота через админ-панель Taskery.",
    );
    return;
  }

  const command = text.split(/\s+/)[0]?.toLowerCase();

  switch (command) {
    case "/menu":
    case "/start":
      await sendAdminMenu(chatId, admin, "main");
      return;
    case "/help": {
      await sendAdminTelegramMessage(String(chatId), telegramHelpText(admin), {
        parseMode: MENU_PARSE_MODE,
        replyMarkup: {
          inline_keyboard: [
            [{ text: "← Главное меню", callback_data: "m:main" }],
          ],
        },
      });
      return;
    }
    case "/pending":
      await sendAdminMenu(chatId, admin, "lp:0");
      return;
    case "/withdrawals":
      await sendAdminMenu(chatId, admin, "lw:0");
      return;
    case "/reports":
      await sendAdminMenu(chatId, admin, "reports");
      return;
    default:
      await sendAdminTelegramMessage(
        String(chatId),
        "Неизвестная команда. /menu — главное меню.",
        {
          parseMode: MENU_PARSE_MODE,
          replyMarkup: {
            inline_keyboard: [
              [{ text: "📋 Меню", callback_data: "m:main" }],
            ],
          },
        },
      );
  }
}

async function handleAdminCallback(update: TelegramUpdate) {
  const callback = update.callback_query;
  if (!callback?.data || !callback.message) return;

  const chatId = callback.message.chat.id;
  const messageId = callback.message.message_id;
  const telegramUserId = callback.from.id;
  const data = callback.data;

  const admin = await resolveAdminByTelegramChat(chatId, telegramUserId);
  if (!admin) {
    await answerAdminTelegramCallback(callback.id, "Нет доступа");
    return;
  }

  const [action, arg] = data.split(":", 2);

  if (action === "m") {
    if (arg === "alerts") {
      const result = await telegramToggleAdminAlerts(admin.id);
      if (!result.ok) {
        await answerAdminTelegramCallback(callback.id, result.error);
        return;
      }
      await answerAdminTelegramCallback(
        callback.id,
        result.enabled ? "Уведомления включены" : "Уведомления выключены",
      );
      await editAdminMenu(chatId, messageId, admin, "settings");
      return;
    }

    const target =
      arg === "main" || arg === "refresh"
        ? "main"
        : arg === "mod"
          ? "mod"
          : arg === "fin"
            ? "fin"
            : arg === "reports"
              ? "reports"
              : arg === "settings"
                ? "settings"
                : "main";

    await answerAdminTelegramCallback(callback.id);
    const ok = await editAdminMenu(chatId, messageId, admin, target);
    if (!ok) {
      await sendAdminMenu(chatId, admin, target);
    }
    return;
  }

  if (action === "lp" || action === "lw") {
    await answerAdminTelegramCallback(callback.id);
    const ok = await editAdminMenu(chatId, messageId, admin, data);
    if (!ok) await sendAdminMenu(chatId, admin, data);
    return;
  }

  if (action === "pv" || action === "wv") {
    await answerAdminTelegramCallback(callback.id);
    const ok = await editAdminMenu(chatId, messageId, admin, data);
    if (!ok) await sendAdminMenu(chatId, admin, data);
    return;
  }

  if (!action || !arg) {
    await answerAdminTelegramCallback(callback.id, "Некорректные данные");
    return;
  }

  let result;
  switch (action) {
    case "pa":
      result = await telegramApproveProject(admin, arg);
      break;
    case "pr":
      result = await telegramRejectProject(admin, arg);
      break;
    case "wa":
      result = await telegramApproveWithdrawal(admin, arg);
      break;
    case "wr":
      result = await telegramRejectWithdrawal(admin, arg);
      break;
    default:
      await answerAdminTelegramCallback(callback.id, "Неизвестное действие");
      return;
  }

  if (!result.ok) {
    await answerAdminTelegramCallback(callback.id, result.error);
    return;
  }

  await answerAdminTelegramCallback(callback.id, "Готово");
  const done = buildAdminActionDoneMenu("✅ <b>Действие выполнено</b>");
  await editAdminTelegramMessage(chatId, messageId, done.text, {
    parseMode: MENU_PARSE_MODE,
    replyMarkup: { inline_keyboard: done.keyboard },
  }).catch(() => undefined);
}

export async function sendAdminWelcomeMenu(chatId: string | number, adminId: string) {
  const admin = await resolveAdminByTelegramChat(chatId);
  if (!admin || admin.id !== adminId) return;

  const screen = await buildAdminMainMenu(admin);
  await sendAdminTelegramMessage(
    String(chatId),
    `✅ <b>Админ-бот подключён!</b>\nУведомления модерации и финансов активны.\n\n${screen.text}`,
    {
      parseMode: MENU_PARSE_MODE,
      replyMarkup: { inline_keyboard: screen.keyboard },
    },
  );
}

export async function handleAdminTelegramUpdate(update: TelegramUpdate) {
  if (update.callback_query) {
    await handleAdminCallback(update);
    return;
  }

  const message = update.message;
  const text = message?.text?.trim();
  const chatId = message?.chat.id;
  const telegramUserId = message?.from?.id;

  if (!text || chatId == null || telegramUserId == null) return;

  if (text.startsWith("/start")) {
    const token = text.slice("/start".length).trim();

    if (!token) {
      await handleAdminCommand(chatId, telegramUserId, "/menu");
      return;
    }

    return;
  }

  if (text.startsWith("/")) {
    await handleAdminCommand(chatId, telegramUserId, text);
  }
}
