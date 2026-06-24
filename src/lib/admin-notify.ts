import type { AdminPermission, NotificationType, Prisma } from "@/generated/prisma/client";
import { sendAdminAlertEmail } from "@/lib/admin-email";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { prisma } from "@/lib/prisma";

type AdminNotifyPayload = {
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  metadata?: Prisma.InputJsonValue;
  emailSubject?: string;
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

  await prisma.notification.createMany({
    data: recipients.map((admin) => ({
      userId: admin.id,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      link: payload.link,
      metadata: payload.metadata,
    })),
  });

  const emailSubject = payload.emailSubject ?? payload.title;
  await Promise.all(
    recipients.map((admin) =>
      sendAdminAlertEmail({
        to: admin.email,
        subject: emailSubject,
        body: payload.body,
        link: payload.link,
      }).catch((error) => {
        console.error("[admin-email]", admin.email, error);
      }),
    ),
  );

  return recipients.length;
}
