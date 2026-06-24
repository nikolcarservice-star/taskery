"use server";

import { actionError } from "@/lib/action-errors";
import { logAdminAction } from "@/lib/admin-audit";
import { requireModerationAdmin } from "@/lib/actions/admin-moderation";
import { deleteLocalAvatar, isManagedImageUrl } from "@/lib/avatar-upload";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ContentModerationState = { error?: string; success?: boolean };

export async function adminApprovePortfolioItem(
  _prevState: ContentModerationState,
  formData: FormData,
): Promise<ContentModerationState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const itemId = (formData.get("itemId") as string | null)?.trim();
  if (!itemId) return actionError("PORTFOLIO_ITEM_NOT_FOUND");

  const item = await prisma.portfolioItem.update({
    where: { id: itemId },
    data: { moderationStatus: "APPROVED", rejectReason: null },
    select: {
      freelancerProfile: { select: { userId: true } },
    },
  });

  await logAdminAction(authResult.admin.id, "PORTFOLIO_APPROVE", {
    targetType: "portfolio",
    targetId: itemId,
  });

  revalidatePath("/admin");
  revalidatePath(`/freelancers/${item.freelancerProfile.userId}`);
  return { success: true };
}

export async function adminRejectPortfolioItem(
  _prevState: ContentModerationState,
  formData: FormData,
): Promise<ContentModerationState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const itemId = (formData.get("itemId") as string | null)?.trim();
  const reason =
    (formData.get("reason") as string | null)?.trim() || "Не соответствует правилам";

  if (!itemId) return actionError("PORTFOLIO_ITEM_NOT_FOUND");

  const item = await prisma.portfolioItem.update({
    where: { id: itemId },
    data: { moderationStatus: "REJECTED", rejectReason: reason },
    select: {
      freelancerProfile: { select: { userId: true } },
    },
  });

  await logAdminAction(authResult.admin.id, "PORTFOLIO_REJECT", {
    targetType: "portfolio",
    targetId: itemId,
    details: { reason },
  });

  revalidatePath("/admin");
  revalidatePath(`/freelancers/${item.freelancerProfile.userId}`);
  return { success: true };
}

export async function adminApproveAvatar(
  _prevState: ContentModerationState,
  formData: FormData,
): Promise<ContentModerationState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  if (!userId) return actionError("USER_NOT_FOUND");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true, pendingAvatar: true },
  });

  if (!user?.pendingAvatar) {
    return actionError("AVATAR_NOT_PENDING_REVIEW");
  }

  if (user.avatar && isManagedImageUrl(user.avatar) && user.avatar !== user.pendingAvatar) {
    await deleteLocalAvatar(user.avatar);
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      avatar: user.pendingAvatar,
      pendingAvatar: null,
    },
  });

  await logAdminAction(authResult.admin.id, "AVATAR_APPROVE", {
    targetType: "user",
    targetId: userId,
  });

  revalidatePath("/admin");
  revalidatePath(`/freelancers/${userId}`);
  return { success: true };
}

export async function adminRejectAvatar(
  _prevState: ContentModerationState,
  formData: FormData,
): Promise<ContentModerationState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  if (!userId) return actionError("USER_NOT_FOUND");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { pendingAvatar: true },
  });

  if (!user?.pendingAvatar) {
    return actionError("AVATAR_NOT_PENDING_REVIEW");
  }

  if (isManagedImageUrl(user.pendingAvatar)) {
    await deleteLocalAvatar(user.pendingAvatar);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { pendingAvatar: null },
  });

  await logAdminAction(authResult.admin.id, "AVATAR_REJECT", {
    targetType: "user",
    targetId: userId,
  });

  revalidatePath("/admin");
  return { success: true };
}
