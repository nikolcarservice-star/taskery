"use server";

import { actionError } from "@/lib/action-errors";
import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { createLocalizedUserNotification } from "@/lib/create-user-notification";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type VerificationActionState = {
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

  return { admin } as const;
}

export async function adminApproveVerification(
  _prevState: VerificationActionState,
  formData: FormData,
): Promise<VerificationActionState> {
  const authResult = await requireUsersAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  if (!userId) return actionError("USER_NOT_FOUND");

  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId },
    select: { verificationStatus: true },
  });

  if (!profile || profile.verificationStatus !== "PENDING") {
    return actionError("VERIFICATION_REQUEST_NOT_FOUND");
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

  await createLocalizedUserNotification({
    userId,
    type: "USER_WARNING",
    template: "VERIFICATION_APPROVED",
    link: `/freelancers/${userId}`,
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

  if (!userId) return actionError("USER_NOT_FOUND");

  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId },
    select: { verificationStatus: true },
  });

  if (!profile || profile.verificationStatus !== "PENDING") {
    return actionError("VERIFICATION_REQUEST_NOT_FOUND");
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

  await createLocalizedUserNotification({
    userId,
    type: "USER_WARNING",
    template: "VERIFICATION_REJECTED",
    variables: { reason: note },
    link: "/dashboard/profile",
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
