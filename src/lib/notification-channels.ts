import type { NotificationType } from "@/generated/prisma/client";

const MESSAGE_NOTIFICATION_TYPES = new Set<NotificationType>([
  "NEW_MESSAGE",
  "BID_MESSAGE",
]);

export function isMessageNotificationType(type: NotificationType): boolean {
  return MESSAGE_NOTIFICATION_TYPES.has(type);
}

export function shouldSendTelegramForType(
  type: NotificationType,
  settings: {
    telegramMessages: boolean;
    telegramNotifications: boolean;
  },
): boolean {
  if (isMessageNotificationType(type)) {
    return settings.telegramMessages;
  }

  return settings.telegramNotifications;
}
