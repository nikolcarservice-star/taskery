"use server";

import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type VerificationActionState = {
  error?: string;
  success?: boolean;
};

async function requireUsersAdmin() {
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

  if (!hasAdminPermission(admin.adminPermissions, "USERS")) {
    return { error: "Недостаточно прав" } as const;
  }

  return { admin } as const;
}

export async function adminApproveVerification(
  _prevState: VerificationActionState,
  formData: FormData,
): Promise<VerificationActionState> {
  const authResult = await requireUsersAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  if (!userId) return { error: "Пользователь не найден" };

  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId },
    select: { verificationStatus: true },
  });

  if (!profile || profile.verificationStatus !== "PENDING") {
    return { error: "Заявка не найдена или уже обработана" };
  }

  const now = new Date();

  await prisma.freelancerProfile.update({
    where: { userId },
    data: {
      verificationStatus: "APPROVED",
      verificationReviewedAt: now,
      verificationNote: null,
      verifiedById: authResult.admin.id,
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      type: "USER_WARNING",
      title: "Профиль верифицирован",
      body: "Администрация подтвердила ваш профиль. Значок верификации отображается на странице профиля.",
      link: `/freelancers/${userId}`,
    },
  });

  await logAdminAction(authResult.admin.id, "VERIFICATION_APPROVE", {
    targetType: "user",
    targetId: userId,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/verification");
  revalidatePath(`/freelancers/${userId}`);
  return { success: true };
}

export async function adminRejectVerification(
  _prevState: VerificationActionState,
  formData: FormData,
): Promise<VerificationActionState> {
  const authResult = await requireUsersAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  const note =
    (formData.get("note") as string | null)?.trim() ||
    "Профиль не прошёл проверку";

  if (!userId) return { error: "Пользователь не найден" };

  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId },
    select: { verificationStatus: true },
  });

  if (!profile || profile.verificationStatus !== "PENDING") {
    return { error: "Заявка не найдена или уже обработана" };
  }

  await prisma.freelancerProfile.update({
    where: { userId },
    data: {
      verificationStatus: "REJECTED",
      verificationReviewedAt: new Date(),
      verificationNote: note,
      verifiedById: authResult.admin.id,
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      type: "USER_WARNING",
      title: "Верификация отклонена",
      body: note,
      link: "/dashboard/profile",
    },
  });

  await logAdminAction(authResult.admin.id, "VERIFICATION_REJECT", {
    targetType: "user",
    targetId: userId,
    details: { note },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/verification");
  return { success: true };
}
