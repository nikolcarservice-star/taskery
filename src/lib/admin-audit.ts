import type { AdminAuditAction, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type AdminAuditEntry = {
  id: string;
  action: AdminAuditAction;
  targetType: string | null;
  targetId: string | null;
  details: unknown;
  createdAt: string;
  admin: { id: string; name: string | null; email: string };
};

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

export const ADMIN_AUDIT_ACTION_LABELS: Record<AdminAuditAction, string> = {
  DISPUTE_RELEASE: "Спор: выплата исполнителю",
  DISPUTE_REFUND: "Спор: возврат заказчику",
  DISPUTE_SPLIT: "Спор: частичное решение",
  PROJECT_CLOSE: "Проект закрыт",
  PROJECT_BLOCK: "Проект заблокирован",
  USER_BAN: "Пользователь заблокирован",
  USER_UNBAN: "Пользователь разблокирован",
  USER_DELETE: "Пользователь удалён",
  REPORT_DISMISS: "Жалобы отклонены",
  REPORT_RESOLVE: "Жалобы решены",
  REPORT_IN_REVIEW: "Жалоба взята в работу",
  STAFF_CREATE: "Админ добавлен",
  STAFF_UPDATE: "Админ изменён",
  STAFF_DEACTIVATE: "Админ деактивирован",
  STAFF_REACTIVATE: "Админ восстановлен",
  STAFF_DELETE: "Админ удалён",
  USER_WARNING: "Предупреждение пользователю",
  USER_TEMP_BAN: "Временная блокировка",
  USER_FINE: "Штраф пользователю",
  BALANCE_ADJUST: "Корректировка баланса",
  TICKET_REPLY: "Ответ в поддержке",
  TICKET_CLOSE: "Обращение закрыто",
  VERIFICATION_APPROVE: "Верификация одобрена",
  VERIFICATION_REJECT: "Верификация отклонена",
  CATALOG_CATEGORY_SAVE: "Категория сохранена",
  CATALOG_SKILL_SAVE: "Навык сохранён",
  WITHDRAWAL_APPROVE: "Вывод одобрен",
  WITHDRAWAL_REJECT: "Вывод отклонён",
};
