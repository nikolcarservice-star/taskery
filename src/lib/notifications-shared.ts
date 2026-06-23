import type { NotificationType } from "@/generated/prisma/client";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  readAt: Date | null;
  createdAt: Date;
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  PROJECT_MATCH: "Новый проект",
  BID_ACCEPTED: "Вас выбрали",
  BID_MESSAGE: "Сообщение по отклику",
  NEW_MESSAGE: "Новое сообщение",
  NEW_BID: "Новый отклик",
  SUPPORT_REPLY: "Поддержка",
  USER_WARNING: "Предупреждение",
  ADMIN_BROADCAST: "Сообщение платформы",
};

export function formatNotificationWhen(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  if (days < 7) return `${days} дн. назад`;

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}
