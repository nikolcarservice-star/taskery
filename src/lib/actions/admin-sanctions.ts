"use server";

import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { createUserNotification } from "@/lib/create-user-notification";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type SanctionActionState = {
  error?: string;
  success?: boolean;
};

async function requireSanctionsAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Доступ запрещён" } as const;
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, adminPermissions: true, adminActive: true },
  });

  if (!admin?.adminActive) {
    return { error: "Аккаунт деактивирован" } as const;
  }

  if (
    !hasAdminPermission(admin.adminPermissions, "USERS") &&
    !hasAdminPermission(admin.adminPermissions, "MODERATION")
  ) {
    return { error: "Недостаточно прав" } as const;
  }

  return { session, admin } as const;
}

async function notifyUser(
  userId: string,
  title: string,
  body: string,
  type: "USER_WARNING" | "SUPPORT_REPLY" = "USER_WARNING",
) {
  await createUserNotification({
    userId,
    type,
    title,
    body,
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

  if (!userId) return { error: "Пользователь не найден" };
  if (userId === authResult.admin.id) {
    return { error: "Нельзя выдать предупреждение себе" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, deletedAt: true },
  });

  if (!user || user.deletedAt) return { error: "Пользователь не найден" };
  if (user.role === "ADMIN") {
    return { error: "Нельзя выдать предупреждение администратору" };
  }

  await prisma.userWarning.create({
    data: {
      userId,
      issuedById: authResult.admin.id,
      reason,
    },
  });

  await notifyUser(
    userId,
    "Предупреждение от администрации",
    reason,
    "USER_WARNING",
  );

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

  if (!userId) return { error: "Пользователь не найден" };

  const days = Number(daysRaw);
  if (!Number.isFinite(days) || days < 1 || days > 365) {
    return { error: "Укажите срок от 1 до 365 дней" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, deletedAt: true },
  });

  if (!user || user.deletedAt) return { error: "Пользователь не найден" };
  if (user.role === "ADMIN") {
    return { error: "Нельзя заблокировать администратора" };
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
    "Временная блокировка аккаунта",
    `Аккаунт заблокирован на ${days} дн. Причина: ${reason}`,
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

  if (!userId) return { error: "Пользователь не найден" };

  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Укажите положительную сумму штрафа" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, deletedAt: true, balance: true },
  });

  if (!user || user.deletedAt) return { error: "Пользователь не найден" };
  if (user.role === "ADMIN") {
    return { error: "Нельзя оштрафовать администратора" };
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

  await notifyUser(
    userId,
    "Штраф от администрации",
    `С баланса списано ${amount.toLocaleString("uk-UA")} ₴. Причина: ${reason}`,
  );

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
