import type { AdminAuditAction, Prisma } from "@/generated/prisma/client";
import type { AdminAuditEntry } from "@/lib/admin-audit-types";
import { prisma } from "@/lib/prisma";

export type { AdminAuditEntry } from "@/lib/admin-audit-types";
export { ADMIN_AUDIT_ACTION_LABELS } from "@/lib/admin-audit-types";

export async function logAdminAction(
  adminId: string,
  action: AdminAuditAction,
  options?: {
    targetType?: string;
    targetId?: string;
    details?: Prisma.InputJsonValue;
  },
) {
  await prisma.adminAuditLog.create({
    data: {
      adminId,
      action,
      targetType: options?.targetType ?? null,
      targetId: options?.targetId ?? null,
      details: options?.details ?? undefined,
    },
  });
}

export async function getRecentAdminAuditLogs(
  limit = 50,
): Promise<AdminAuditEntry[]> {
  const rows = await prisma.adminAuditLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      admin: { select: { id: true, name: true, email: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    action: row.action,
    targetType: row.targetType,
    targetId: row.targetId,
    details: row.details,
    createdAt: row.createdAt.toISOString(),
    admin: row.admin,
  }));
}
