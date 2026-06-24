import type { NotificationType, Prisma } from "@/generated/prisma/client";
import { getEmailLocaleForUser, parseInterfaceLanguage } from "@/lib/i18n/user-locale";
import type { AppLocale } from "@/lib/i18n/types";
import {
  buildNotification,
  getRoleFallbackName,
  type NotificationTemplateKey,
  type RoleFallbackKey,
} from "@/lib/notification-i18n";
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

export type LocalizedUserNotificationInput = {
  userId: string;
  type: NotificationType;
  template: NotificationTemplateKey;
  variables?: Record<string, string>;
  variableFallbacks?: Partial<Record<string, RoleFallbackKey>>;
  link?: string | null;
  metadata?: Prisma.InputJsonValue;
};

function resolveNotificationVariables(
  locale: AppLocale,
  variables?: Record<string, string>,
  fallbacks?: Partial<Record<string, RoleFallbackKey>>,
): Record<string, string> {
  const resolved = { ...variables };
  for (const [key, role] of Object.entries(fallbacks ?? {})) {
    if (!role || resolved[key]?.trim()) {
      continue;
    }
    resolved[key] = getRoleFallbackName(locale, role);
  }
  return resolved;
}

async function getLocalesForUsers(
  userIds: string[],
): Promise<Map<string, AppLocale>> {
  if (userIds.length === 0) {
    return new Map();
  }

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      interfaceLanguage: true,
      settings: { select: { preferredLocale: true } },
    },
  });

  const locales = new Map<string, AppLocale>();
  for (const user of users) {
    locales.set(
      user.id,
      parseInterfaceLanguage(
        user.interfaceLanguage ?? user.settings?.preferredLocale,
      ),
    );
  }
  return locales;
}

export async function createLocalizedUserNotification({
  userId,
  type,
  template,
  variables,
  variableFallbacks,
  link,
  metadata,
  push = true,
  telegram = true,
}: LocalizedUserNotificationInput & {
  push?: boolean;
  telegram?: boolean;
}) {
  const locale = await getEmailLocaleForUser(userId);
  const { title, body } = buildNotification(
    locale,
    template,
    resolveNotificationVariables(locale, variables, variableFallbacks),
  );

  await createUserNotification({
    userId,
    type,
    title,
    body,
    link,
    metadata,
    push,
    telegram,
  });
}

export async function createLocalizedUserNotificationsBatch(
  items: LocalizedUserNotificationInput[],
  options?: { push?: boolean; telegram?: boolean },
) {
  if (items.length === 0) {
    return;
  }

  const locales = await getLocalesForUsers(items.map((item) => item.userId));
  const resolved = items.map((item) => {
    const locale = locales.get(item.userId) ?? parseInterfaceLanguage(null);
    const { title, body } = buildNotification(
      locale,
      item.template,
      resolveNotificationVariables(locale, item.variables, item.variableFallbacks),
    );
    return {
      userId: item.userId,
      type: item.type,
      title,
      body,
      link: item.link,
      metadata: item.metadata,
    };
  });

  await createUserNotificationsBatch(resolved, options);
}
