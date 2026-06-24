"use server";

import { actionError } from "@/lib/action-errors";
import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { createLocalizedUserNotification } from "@/lib/create-user-notification";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type SanctionActionState = {
  error?: string;
  success?: boolean;
};

async function requireSanctionsAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return actionError("ACCESS_DENIED");
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, adminPermissions: true, adminActive: true },
  });

  if (!admin?.adminActive) {
    return actionError("ADMIN_ACCOUNT_DEACTIVATED");
  }

  if (
    !hasAdminPermission(admin.adminPermissions, "USERS") &&
    !hasAdminPermission(admin.adminPermissions, "MODERATION")
  ) {
    return actionError("ADMIN_INSUFFICIENT_PERMISSION");
  }

  return { session, admin } as const;
}

async function notifyUser(
  userId: string,
  template:
    | "SANCTION_WARNING"
    | "SANCTION_TEMP_BAN"
    | "SANCTION_FINE",
  variables: Record<string, string>,
  type: "USER_WARNING" | "SUPPORT_REPLY" = "USER_WARNING",
) {
  await createLocalizedUserNotification({
    userId,
    type,
    template,
    variables,
  });
}

export async function adminIssueWarning(
  _prevState: SanctionActionState,
  formData: FormData,
): Promise<SanctionActionState> {
  const authResult = await requireSanctionsAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  const reason =
    (formData.get("reason") as string | null)?.trim() ||
    "Предупреждение от администратора";

  if (!userId) return actionError("USER_NOT_FOUND");
  if (userId === authResult.admin.id) {
    return actionError("CANNOT_TARGET_SELF");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, deletedAt: true },
  });

  if (!user || user.deletedAt) return actionError("USER_NOT_FOUND");
  if (user.role === "ADMIN") {
    return actionError("CANNOT_TARGET_ADMIN");
  }

  await prisma.userWarning.create({
    data: {
      userId,
      issuedById: authResult.admin.id,
      reason,
    },
  });

  await notifyUser(userId, "SANCTION_WARNING", { reason }, "USER_WARNING");

  await logAdminAction(authResult.admin.id, "USER_WARNING", {
    targetType: "user",
    targetId: userId,
    details: { reason },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/users");
  return { success: true };
}

export async function adminTempBanUser(
  _prevState: SanctionActionState,
  formData: FormData,
): Promise<SanctionActionState> {
  const authResult = await requireSanctionsAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  const daysRaw = (formData.get("days") as string | null)?.trim();
  const reason =
    (formData.get("reason") as string | null)?.trim() ||
    "Временная блокировка";

  if (!userId) return actionError("USER_NOT_FOUND");

  const days = Number(daysRaw);
  if (!Number.isFinite(days) || days < 1 || days > 365) {
    return actionError("BAN_DAYS_RANGE");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, deletedAt: true },
  });

  if (!user || user.deletedAt) return actionError("USER_NOT_FOUND");
  if (user.role === "ADMIN") {
    return actionError("CANNOT_TARGET_ADMIN");
  }

  const bannedUntil = new Date();
  bannedUntil.setDate(bannedUntil.getDate() + days);

  await prisma.user.update({
    where: { id: userId },
    data: {
      bannedAt: new Date(),
      bannedUntil,
      banReason: `${reason} (до ${bannedUntil.toLocaleDateString("ru-RU")})`,
    },
  });

  await notifyUser(
    userId,
    "SANCTION_TEMP_BAN",
    { days: String(days), reason },
  );

  await logAdminAction(authResult.admin.id, "USER_TEMP_BAN", {
    targetType: "user",
    targetId: userId,
    details: { reason, days, bannedUntil: bannedUntil.toISOString() },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/users");
  return { success: true };
}

export async function adminFineUser(
  _prevState: SanctionActionState,
  formData: FormData,
): Promise<SanctionActionState> {
  const authResult = await requireSanctionsAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  const amountRaw = (formData.get("amount") as string | null)?.trim();
  const reason =
    (formData.get("reason") as string | null)?.trim() ||
    "Штраф от администратора";

  if (!userId) return actionError("USER_NOT_FOUND");

  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0) {
    return actionError("FINE_AMOUNT_POSITIVE");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, deletedAt: true, balance: true },
  });

  if (!user || user.deletedAt) return actionError("USER_NOT_FOUND");
  if (user.role === "ADMIN") {
    return actionError("CANNOT_TARGET_ADMIN");
  }

  const currentBalance = Number(user.balance);
  if (currentBalance < amount) {
    return {
      error: `Недостаточно средств на балансе (доступно ${currentBalance.toLocaleString("uk-UA")} ₴)`,
    };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } },
    }),
    prisma.payment.create({
      data: {
        userId,
        amount,
        type: "FINE",
        status: "COMPLETED",
        metadata: { reason, adminId: authResult.admin.id },
      },
    }),
  ]);

  await notifyUser(userId, "SANCTION_FINE", {
    amount: `${amount.toLocaleString("uk-UA")} ₴`,
    reason,
  });

  await logAdminAction(authResult.admin.id, "USER_FINE", {
    targetType: "user",
    targetId: userId,
    details: { reason, amount },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/users");
  revalidatePath("/admin/mobile/finance");
  return { success: true };
}
