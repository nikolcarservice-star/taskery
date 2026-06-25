import {
  deleteAdminTelegramMessage,
} from "@/lib/telegram/admin-bot";
import { prisma } from "@/lib/prisma";

export type AdminTelegramAlertScope = "project_moderation" | "withdrawal";

export async function recordAdminTelegramAlert(
  scope: AdminTelegramAlertScope,
  targetId: string,
  chatId: string,
  messageId: number,
) {
  await prisma.adminTelegramAlert.create({
    data: { scope, targetId, chatId, messageId },
  });
}

export async function clearAdminTelegramAlerts(
  scope: AdminTelegramAlertScope,
  targetId: string,
) {
  const rows = await prisma.adminTelegramAlert.findMany({
    where: { scope, targetId },
  });

  if (rows.length === 0) return;

  await Promise.all(
    rows.map((row) =>
      deleteAdminTelegramMessage(row.chatId, row.messageId).catch(() => false),
    ),
  );

  await prisma.adminTelegramAlert.deleteMany({
    where: { scope, targetId },
  });
}

export function adminTelegramAlertScopeForTemplate(
  template: string,
  metadata?: Record<string, string>,
): { scope: AdminTelegramAlertScope; targetId: string } | null {
  if (template === "ADMIN_PROJECT_PENDING" && metadata?.projectId) {
    return { scope: "project_moderation", targetId: metadata.projectId };
  }
  if (template === "ADMIN_WITHDRAWAL_REQUEST" && metadata?.paymentId) {
    return { scope: "withdrawal", targetId: metadata.paymentId };
  }
  return null;
}
