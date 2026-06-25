import {
  answerAdminTelegramCallback,
  editAdminTelegramMessage,
  sendAdminTelegramMessage,
} from "@/lib/telegram/admin-bot";
import {
  telegramApproveProject,
  telegramApproveWithdrawal,
  telegramHelpText,
  telegramListPendingProjects,
  telegramListPendingReports,
  telegramListPendingWithdrawals,
  telegramRejectProject,
  telegramRejectWithdrawal,
} from "@/lib/telegram/admin-ops";
import { resolveAdminByTelegramChat } from "@/lib/telegram/resolve";
import type { TelegramUpdate } from "@/lib/telegram/types";

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
    case "/help":
    case "/start": {
      await sendAdminTelegramMessage(String(chatId), telegramHelpText(admin));
      return;
    }
    case "/pending": {
      const result = await telegramListPendingProjects(admin);
      if (!result.ok) {
        await sendAdminTelegramMessage(String(chatId), result.error);
        return;
      }
      await sendAdminTelegramMessage(String(chatId), result.text);
      return;
    }
    case "/withdrawals": {
      const result = await telegramListPendingWithdrawals(admin);
      if (!result.ok) {
        await sendAdminTelegramMessage(String(chatId), result.error);
        return;
      }
      await sendAdminTelegramMessage(String(chatId), result.text);
      return;
    }
    case "/reports": {
      const result = await telegramListPendingReports(admin);
      if (!result.ok) {
        await sendAdminTelegramMessage(String(chatId), result.error);
        return;
      }
      await sendAdminTelegramMessage(String(chatId), result.text);
      return;
    }
    default:
      await sendAdminTelegramMessage(
        String(chatId),
        "Неизвестная команда. /help — список команд.",
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

  const [action, targetId] = data.split(":", 2);
  if (!action || !targetId) {
    await answerAdminTelegramCallback(callback.id, "Некорректные данные");
    return;
  }

  let result;
  switch (action) {
    case "pa":
      result = await telegramApproveProject(admin, targetId);
      break;
    case "pr":
      result = await telegramRejectProject(admin, targetId);
      break;
    case "wa":
      result = await telegramApproveWithdrawal(admin, targetId);
      break;
    case "wr":
      result = await telegramRejectWithdrawal(admin, targetId);
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
  await editAdminTelegramMessage(
    chatId,
    messageId,
    "✅ Действие выполнено.",
  ).catch(() => undefined);
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
      await handleAdminCommand(chatId, telegramUserId, "/help");
      return;
    }

    // Linking is handled in the webhook route before dispatch
    return;
  }

  if (text.startsWith("/")) {
    await handleAdminCommand(chatId, telegramUserId, text);
  }
}
