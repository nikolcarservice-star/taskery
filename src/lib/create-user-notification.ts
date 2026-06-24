import type { NotificationType, Prisma } from "@/generated/prisma/client";
import { sendPushToUser } from "@/lib/push-notifications";
import { sendTelegramToUser } from "@/lib/telegram";
import { prisma } from "@/lib/prisma";

export async function createUserNotification({
  userId,
  type,
  title,
  body,
  link,
  metadata,
  push = true,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  metadata?: Prisma.InputJsonValue;
  push?: boolean;
}) {
  await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      link,
      metadata,
    },
  });

  if (push) {
    await sendPushToUser(userId, {
      title,
      body,
      url: link,
    }).catch((error) => {
      console.error("[createUserNotification push]", userId, error);
    });
  }

  await sendTelegramToUser(userId, title, body, link).catch((error) => {
    console.error("[createUserNotification telegram]", userId, error);
  });
}
