import type { AdminPermission, NotificationType, Prisma } from "@/generated/prisma/client";
import { sendAdminAlertEmail } from "@/lib/admin-email";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { createLocalizedUserNotificationsBatch } from "@/lib/create-user-notification";
import { getEmailLocaleForUser } from "@/lib/i18n/user-locale";
import {
  buildNotification,
  type NotificationTemplateKey,
} from "@/lib/notification-i18n";
import { prisma } from "@/lib/prisma";
import {
  adminPermissionForNotificationType,
  sendAdminTelegramToUser,
} from "@/lib/telegram/admin-bot";

type AdminNotifyPayload = {
  type: NotificationType;
  template: NotificationTemplateKey;
  variables?: Record<string, string>;
  link: string;
  metadata?: Prisma.InputJsonValue;
};

function metadataAsStrings(
  metadata?: Prisma.InputJsonValue,
): Record<string, string> | undefined {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return undefined;
  }
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === "string") result[key] = value;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

export async function notifyAdminsWithPermission(
  permission: AdminPermission,
  payload: AdminNotifyPayload,
) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", adminActive: true },
    select: { id: true, email: true, adminPermissions: true },
  });

  const recipients = admins.filter((admin) =>
    hasAdminPermission(admin.adminPermissions, permission),
  );

  if (recipients.length === 0) {
    return 0;
  }

  await createLocalizedUserNotificationsBatch(
    recipients.map((admin) => ({
      userId: admin.id,
      type: payload.type,
      template: payload.template,
      variables: payload.variables,
      link: payload.link,
      metadata: payload.metadata,
    })),
    { push: false, telegram: false },
  );

  const metaStrings = metadataAsStrings(payload.metadata);
  const requiredPermission = adminPermissionForNotificationType(payload.type);

  await Promise.all(
    recipients.map(async (admin) => {
      const locale = await getEmailLocaleForUser(admin.id);
      const { title, body } = buildNotification(
        locale,
        payload.template,
        payload.variables ?? {},
      );

      await sendAdminAlertEmail({
        to: admin.email,
        subject: title,
        body,
        link: payload.link,
      }).catch((error) => {
        console.error("[admin-email]", admin.email, error);
      });

      await sendAdminTelegramToUser(admin.id, admin.adminPermissions, {
        template: payload.template,
        variables: payload.variables,
        link: payload.link,
        metadata: metaStrings,
        requiredPermission,
      });
    }),
  );

  return recipients.length;
}
