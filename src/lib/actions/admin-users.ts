"use server";

import { actionError } from "@/lib/action-errors";
import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type UserActionState = {
  error?: string;
  success?: boolean;
};

async function requireUsersAdmin() {
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

  if (!hasAdminPermission(admin.adminPermissions, "USERS")) {
    return actionError("ADMIN_INSUFFICIENT_PERMISSION");
  }

  return { session, admin } as const;
}

export async function adminUsersBan(
  _prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const authResult = await requireUsersAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  const reason =
    (formData.get("reason") as string | null)?.trim() ||
    "Заблокирован администратором";

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

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { bannedAt: new Date(), banReason: reason },
    }),
    prisma.project.updateMany({
      where: { clientId: userId, status: "OPEN", blockedAt: null },
      data: {
        status: "CLOSED",
        blockedAt: new Date(),
        blockReason: reason,
        hiddenFromCatalog: true,
      },
    }),
  ]);

  await logAdminAction(authResult.admin.id, "USER_BAN", {
    targetType: "user",
    targetId: userId,
    details: { reason },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function adminUsersUnban(
  _prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const authResult = await requireUsersAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  if (!userId) return actionError("USER_NOT_FOUND");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, deletedAt: true, bannedAt: true },
  });

  if (!user || user.deletedAt) return actionError("USER_NOT_FOUND");
  if (!user.bannedAt) return actionError("USER_NOT_BANNED");

  await prisma.user.update({
    where: { id: userId },
    data: { bannedAt: null, bannedUntil: null, banReason: null },
  });

  await logAdminAction(authResult.admin.id, "USER_UNBAN", {
    targetType: "user",
    targetId: userId,
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function adminUsersDelete(
  _prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const authResult = await requireUsersAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  const reason =
    (formData.get("reason") as string | null)?.trim() ||
    "Удалён администратором";

  if (!userId) return actionError("USER_NOT_FOUND");
  if (userId === authResult.admin.id) {
    return actionError("CANNOT_TARGET_SELF");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      email: true,
      contractsAsClient: {
        where: { status: { in: ["ESCROWED", "AWAITING_FUNDING"] } },
        select: { id: true },
      },
      contractsAsFreelancer: {
        where: { status: { in: ["ESCROWED", "AWAITING_FUNDING"] } },
        select: { id: true },
      },
    },
  });

  if (!user) return actionError("USER_NOT_FOUND");
  if (user.role === "ADMIN") {
    return actionError("CANNOT_TARGET_ADMIN");
  }

  const activeContracts =
    user.contractsAsClient.length + user.contractsAsFreelancer.length;
  if (activeContracts > 0) {
    return {
      error:
        "Нельзя удалить пользователя с активными эскроу-сделками",
    };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        bannedAt: new Date(),
        banReason: reason,
        email: `deleted+${user.id}@taskery.local`,
        name: "Удалён",
        firstName: null,
        lastName: null,
        avatar: null,
        bio: null,
        phone: null,
        passwordHash: null,
      },
    }),
    prisma.project.updateMany({
      where: { clientId: userId, status: "OPEN" },
      data: {
        status: "CLOSED",
        blockedAt: new Date(),
        blockReason: reason,
        hiddenFromCatalog: true,
      },
    }),
  ]);

  await logAdminAction(authResult.admin.id, "USER_DELETE", {
    targetType: "user",
    targetId: userId,
    details: { reason },
  });

  revalidatePath("/admin");
  return { success: true };
}
