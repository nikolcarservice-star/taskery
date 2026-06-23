import { hasAdminPermission } from "@/lib/admin-permissions";
import type { AdminPermission } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getModerationAttentionItems } from "@/lib/queries/admin-attention";
import { getPendingAdminReports } from "@/lib/queries/admin-reports";

export type AdminMobileBadges = {
  moderation: number;
  finance: number;
};

export async function getAdminMobileBadges(
  permissions: AdminPermission[],
  adminId: string,
): Promise<AdminMobileBadges> {
  const badges: AdminMobileBadges = { moderation: 0, finance: 0 };

  const tasks: Promise<void>[] = [];

  if (hasAdminPermission(permissions, "MODERATION")) {
    tasks.push(
      (async () => {
        const [attention, reports, disputes] = await Promise.all([
          getModerationAttentionItems(adminId),
          getPendingAdminReports(),
          prisma.project.count({ where: { status: "UNDER_DISPUTE" } }),
        ]);
        badges.moderation = attention.length + reports.length + disputes;
      })(),
    );
  }

  if (hasAdminPermission(permissions, "FINANCE")) {
    tasks.push(
      (async () => {
        badges.finance = await prisma.contract.count({
          where: { status: { in: ["ESCROWED", "AWAITING_FUNDING"] } },
        });
      })(),
    );
  }

  await Promise.all(tasks);
  return badges;
}
