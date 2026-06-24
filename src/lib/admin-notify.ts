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

type AdminNotifyPayload = {
  type: NotificationType;
  template: NotificationTemplateKey;
  variables?: Record<string, string>;
  link: string;
  metadata?: Prisma.InputJsonValue;
};

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
    }),
  );

  return recipients.length;
}
