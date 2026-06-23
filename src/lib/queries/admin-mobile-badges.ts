import { hasAdminPermission } from "@/lib/admin-permissions";
import type { AdminPermission } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getModerationAttentionItems } from "@/lib/queries/admin-attention";
import { getPendingAdminReports } from "@/lib/queries/admin-reports";
import { getOpenSupportTicketCount } from "@/lib/queries/admin-support";
import { getPendingWithdrawalCount } from "@/lib/queries/admin-withdrawals";
import { getPendingVerificationCount } from "@/lib/queries/admin-verification";

export type AdminMobileBadges = {
  moderation: number;
  finance: number;
  verification: number;
  withdrawals: number;
};

export async function getAdminMobileBadges(
  permissions: AdminPermission[],
  adminId: string,
): Promise<AdminMobileBadges> {
  const badges: AdminMobileBadges = {
    moderation: 0,
    finance: 0,
    verification: 0,
    withdrawals: 0,
  };

  const tasks: Promise<void>[] = [];

  if (hasAdminPermission(permissions, "MODERATION")) {
    tasks.push(
      (async () => {
        const [attention, reports, disputes, supportCount] = await Promise.all([
          getModerationAttentionItems(adminId),
          getPendingAdminReports(),
          prisma.project.count({ where: { status: "UNDER_DISPUTE" } }),
          getOpenSupportTicketCount(),
        ]);
        badges.moderation =
          attention.length + reports.length + disputes + supportCount;
      })(),
    );
  }

  if (hasAdminPermission(permissions, "FINANCE")) {
    tasks.push(
      (async () => {
        const [escrowCount, withdrawalCount] = await Promise.all([
          prisma.contract.count({
            where: { status: { in: ["ESCROWED", "AWAITING_FUNDING"] } },
          }),
          getPendingWithdrawalCount(),
        ]);
        badges.finance = escrowCount;
        badges.withdrawals = withdrawalCount;
      })(),
    );
  }

  if (hasAdminPermission(permissions, "USERS")) {
    tasks.push(
      (async () => {
        badges.verification = await getPendingVerificationCount();
      })(),
    );
  }

  await Promise.all(tasks);
  return badges;
}
