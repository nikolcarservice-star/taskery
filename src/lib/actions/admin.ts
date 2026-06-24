"use server";

import { actionError } from "@/lib/action-errors";
import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import {
  atomicRefundContract,
  atomicReleaseDispute,
  atomicSplitDispute,
  calculateSplitDisputeAmounts,
  mapEscrowError,
} from "@/lib/escrow-ops";
import { createLocalizedUserNotification } from "@/lib/create-user-notification";
import {
  refundStripeEscrowFunding,
  refundStripeEscrowFundingPartial,
  StripeRefundError,
} from "@/lib/stripe-refund";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionState = {
  error?: string;
  success?: boolean;
};

async function requireAdminSession(
  permission?: Parameters<typeof hasAdminPermission>[1],
) {
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

  if (permission && !hasAdminPermission(admin.adminPermissions, permission)) {
    return actionError("ADMIN_INSUFFICIENT_PERMISSION");
  }

  return { session, admin } as const;
}

function escrowErrorMessage(error: unknown): string {
  if (error instanceof StripeRefundError) return error.message;
  return mapEscrowError(error);
}

async function loadDisputeProject(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: { contract: true },
  });
}

export async function adminReleaseDispute(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authResult = await requireAdminSession("MODERATION");
  if ("error" in authResult) return { error: authResult.error };

  const projectId = (formData.get("projectId") as string | null)?.trim();
  if (!projectId) return actionError("PROJECT_NOT_FOUND");

  const project = await loadDisputeProject(projectId);
  if (!project?.contract) return actionError("CONTRACT_NOT_FOUND");
  if (project.status !== "UNDER_DISPUTE") {
    return actionError("PROJECT_NOT_IN_DISPUTE");
  }
  if (project.contract.status !== "ESCROWED") {
    return actionError("FUNDS_ALREADY_PROCESSED");
  }

  const payout = Number(project.contract.freelancerPayout);
  const commission = Number(project.contract.commission);

  try {
    await atomicReleaseDispute(
      project.contract.id,
      projectId,
      project.contract.freelancerId,
      payout,
      commission,
      project.clientId,
    );
  } catch (error) {
    return { error: escrowErrorMessage(error) };
  }

  await logAdminAction(authResult.admin.id, "DISPUTE_RELEASE", {
    targetType: "project",
    targetId: projectId,
    details: { contractId: project.contract.id, payout, commission },
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/admin/mobile/moderation");
  revalidatePath(`/projects/${projectId}`);

  return { success: true };
}

export async function adminRefundDispute(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authResult = await requireAdminSession("MODERATION");
  if ("error" in authResult) return { error: authResult.error };

  const projectId = (formData.get("projectId") as string | null)?.trim();
  if (!projectId) return actionError("PROJECT_NOT_FOUND");

  const project = await loadDisputeProject(projectId);
  if (!project?.contract) return actionError("CONTRACT_NOT_FOUND");
  if (project.status !== "UNDER_DISPUTE") {
    return actionError("PROJECT_NOT_IN_DISPUTE");
  }
  if (project.contract.status !== "ESCROWED") {
    return actionError("FUNDS_ALREADY_PROCESSED");
  }

  const amount = Number(project.contract.amount);

  let stripeRefunded = false;
  try {
    const stripeResult = await refundStripeEscrowFunding(
      project.contract.id,
      project.clientId,
    );
    stripeRefunded = stripeResult.refunded;
  } catch (error) {
    return { error: escrowErrorMessage(error) };
  }

  try {
    await atomicRefundContract(
      project.contract.id,
      projectId,
      project.clientId,
      amount,
      { creditBalance: !stripeRefunded },
    );
  } catch (error) {
    return { error: escrowErrorMessage(error) };
  }

  await createLocalizedUserNotification({
    userId: project.clientId,
    type: "USER_WARNING",
    template: stripeRefunded
      ? "DISPUTE_REFUND_CLIENT_STRIPE"
      : "DISPUTE_REFUND_CLIENT_BALANCE",
    variables: { projectTitle: project.title },
    link: `/client/finances`,
  });

  await logAdminAction(authResult.admin.id, "DISPUTE_REFUND", {
    targetType: "project",
    targetId: projectId,
    details: {
      contractId: project.contract.id,
      amount,
      stripeRefunded,
    },
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/admin/mobile/moderation");
  revalidatePath(`/projects/${projectId}`);

  return { success: true };
}

export async function adminSplitDispute(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authResult = await requireAdminSession("MODERATION");
  if ("error" in authResult) return { error: authResult.error };

  const projectId = (formData.get("projectId") as string | null)?.trim();
  const percentRaw = (formData.get("freelancerPercent") as string | null)?.trim();

  if (!projectId) return actionError("PROJECT_NOT_FOUND");

  const freelancerPercent = Number(percentRaw);
  if (
    !Number.isFinite(freelancerPercent) ||
    freelancerPercent <= 0 ||
    freelancerPercent >= 100
  ) {
    return actionError("DISPUTE_SPLIT_PERCENT_RANGE");
  }

  const project = await loadDisputeProject(projectId);
  if (!project?.contract) return actionError("CONTRACT_NOT_FOUND");
  if (project.status !== "UNDER_DISPUTE") {
    return actionError("PROJECT_NOT_IN_DISPUTE");
  }
  if (project.contract.status !== "ESCROWED") {
    return actionError("FUNDS_ALREADY_PROCESSED");
  }

  const amount = Number(project.contract.amount);
  const commission = Number(project.contract.commission);
  const payout = Number(project.contract.freelancerPayout);

  const { clientRefund } = calculateSplitDisputeAmounts(
    amount,
    commission,
    payout,
    freelancerPercent,
  );

  let stripeRefunded = false;
  let stripeRefundedAmount = 0;
  try {
    const stripeResult = await refundStripeEscrowFundingPartial(
      project.contract.id,
      project.clientId,
      clientRefund,
    );
    stripeRefunded = stripeResult.refunded;
    stripeRefundedAmount = stripeResult.refundedAmount;
  } catch (error) {
    return { error: escrowErrorMessage(error) };
  }

  const balanceCredit = stripeRefunded
    ? Math.max(0, Math.round((clientRefund - stripeRefundedAmount) * 100) / 100)
    : clientRefund;

  try {
    await atomicSplitDispute(
      project.contract.id,
      projectId,
      project.contract.freelancerId,
      project.clientId,
      amount,
      commission,
      payout,
      freelancerPercent,
      { clientBalanceRefund: balanceCredit },
    );
  } catch (error) {
    return { error: escrowErrorMessage(error) };
  }

  if (clientRefund > 0) {
    const refundAmount = (
      stripeRefundedAmount > 0 ? stripeRefundedAmount : clientRefund
    ).toLocaleString("uk-UA");

    await createLocalizedUserNotification({
      userId: project.clientId,
      type: "USER_WARNING",
      template:
        stripeRefundedAmount > 0
          ? "DISPUTE_SPLIT_CLIENT_STRIPE"
          : "DISPUTE_SPLIT_CLIENT_BALANCE",
      variables: {
        amount: refundAmount,
        projectTitle: project.title,
      },
      link: `/client/finances`,
    });
  }

  await logAdminAction(authResult.admin.id, "DISPUTE_SPLIT", {
    targetType: "project",
    targetId: projectId,
    details: {
      contractId: project.contract.id,
      freelancerPercent,
      amount,
      clientRefund,
      stripeRefundedAmount,
    },
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/admin/mobile/moderation");
  revalidatePath(`/projects/${projectId}`);

  return { success: true };
}

export async function adminCloseProject(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authResult = await requireAdminSession("MODERATION");
  if ("error" in authResult) return { error: authResult.error };

  const projectId = (formData.get("projectId") as string | null)?.trim();
  if (!projectId) return actionError("PROJECT_NOT_FOUND");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { contract: true },
  });

  if (!project) return actionError("PROJECT_NOT_FOUND");

  if (
    project.contract &&
    (project.contract.status === "ESCROWED" ||
      project.contract.status === "AWAITING_FUNDING")
  ) {
    return actionError("CANNOT_CLOSE_ACTIVE_ESCROW");
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "CLOSED" },
  });

  await logAdminAction(authResult.admin.id, "PROJECT_CLOSE", {
    targetType: "project",
    targetId: projectId,
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/admin/mobile/moderation");
  revalidatePath(`/projects/${projectId}`);

  return { success: true };
}
