import type { NotificationType, Prisma } from "@/generated/prisma/client";
import { shouldSendTelegramForType } from "@/lib/notification-channels";
import { sendPushToUser } from "@/lib/push-notifications";
import { sendTelegramToUser } from "@/lib/telegram";
import { prisma } from "@/lib/prisma";

const DELIVERY_BATCH_SIZE = 50;

export type UserNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string | null;
  metadata?: Prisma.InputJsonValue;
};

async function deliverNotificationChannels(
  item: UserNotificationInput,
  options?: { push?: boolean; telegram?: boolean },
) {
  if (options?.push !== false) {
    await sendPushToUser(item.userId, {
      title: item.title,
      body: item.body,
      url: item.link ?? undefined,
    }).catch((error) => {
      console.error("[createUserNotification push]", item.userId, error);
    });
  }

  if (options?.telegram !== false) {
    await sendTelegramToUser(
      item.userId,
      item.title,
      item.body,
      item.link ?? undefined,
      item.type,
    ).catch((error) => {
      console.error("[createUserNotification telegram]", item.userId, error);
    });
  }
}

export async function createUserNotification({
  userId,
  type,
  title,
  body,
  link,
  metadata,
  push = true,
  telegram = true,
}: UserNotificationInput & {
  push?: boolean;
  telegram?: boolean;
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

  await deliverNotificationChannels(
    { userId, type, title, body, link, metadata },
    { push, telegram },
  );
}

export async function createUserNotificationsBatch(
  items: UserNotificationInput[],
  options?: { push?: boolean; telegram?: boolean },
) {
  if (items.length === 0) {
    return;
  }

  await prisma.notification.createMany({
    data: items.map((item) => ({
      userId: item.userId,
      type: item.type,
      title: item.title,
      body: item.body,
      link: item.link,
      metadata: item.metadata,
    })),
  });

  for (let offset = 0; offset < items.length; offset += DELIVERY_BATCH_SIZE) {
    const chunk = items.slice(offset, offset + DELIVERY_BATCH_SIZE);
    await Promise.all(
      chunk.map((item) => deliverNotificationChannels(item, options)),
    );
  }
}
