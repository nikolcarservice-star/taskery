import type { AdminPermission, NotificationType, Prisma } from "@/generated/prisma/client";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { prisma } from "@/lib/prisma";

type AdminNotifyPayload = {
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  metadata?: Prisma.InputJsonValue;
};

export async function notifyAdminsWithPermission(
  permission: AdminPermission,
  payload: AdminNotifyPayload,
) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", adminActive: true },
    select: { id: true, adminPermissions: true },
  });

  const recipientIds = admins
    .filter((admin) => hasAdminPermission(admin.adminPermissions, permission))
    .map((admin) => admin.id);

  if (recipientIds.length === 0) {
    return 0;
  }

  await prisma.notification.createMany({
    data: recipientIds.map((userId) => ({
      userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      link: payload.link,
      metadata: payload.metadata,
    })),
  });

  return recipientIds.length;
}
