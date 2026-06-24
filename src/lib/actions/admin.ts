"use server";

import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import {
  EscrowError,
  atomicRefundContract,
  atomicReleaseDispute,
  atomicSplitDispute,
  calculateSplitDisputeAmounts,
} from "@/lib/escrow-ops";
import { createUserNotification } from "@/lib/create-user-notification";
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
    return { error: "Доступ запрещён" } as const;
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, adminPermissions: true, adminActive: true },
  });

  if (!admin?.adminActive) {
    return { error: "Аккаунт деактивирован" } as const;
  }

  if (permission && !hasAdminPermission(admin.adminPermissions, permission)) {
    return { error: "Недостаточно прав" } as const;
  }

  return { session, admin } as const;
}

function escrowErrorMessage(error: unknown): string {
  if (error instanceof EscrowError) return error.message;
  if (error instanceof StripeRefundError) return error.message;
  return "Не удалось выполнить операцию";
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
  if (!projectId) return { error: "Проект не найден" };

  const project = await loadDisputeProject(projectId);
  if (!project?.contract) return { error: "Сделка не найдена" };
  if (project.status !== "UNDER_DISPUTE") {
    return { error: "Проект не в статусе спора" };
  }
  if (project.contract.status !== "ESCROWED") {
    return { error: "Средства уже обработаны" };
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
  if (!projectId) return { error: "Проект не найден" };

  const project = await loadDisputeProject(projectId);
  if (!project?.contract) return { error: "Сделка не найдена" };
  if (project.status !== "UNDER_DISPUTE") {
    return { error: "Проект не в статусе спора" };
  }
  if (project.contract.status !== "ESCROWED") {
    return { error: "Средства уже обработаны" };
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

  await createUserNotification({
    userId: project.clientId,
    type: "USER_WARNING",
    title: "Спор решён в вашу пользу",
    body: stripeRefunded
      ? `Средства по проекту «${project.title}» возвращены на карту через Stripe.`
      : `Средства по проекту «${project.title}» возвращены на баланс.`,
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

  if (!projectId) return { error: "Проект не найден" };

  const freelancerPercent = Number(percentRaw);
  if (
    !Number.isFinite(freelancerPercent) ||
    freelancerPercent <= 0 ||
    freelancerPercent >= 100
  ) {
    return { error: "Укажите процент исполнителю от 1 до 99" };
  }

  const project = await loadDisputeProject(projectId);
  if (!project?.contract) return { error: "Сделка не найдена" };
  if (project.status !== "UNDER_DISPUTE") {
    return { error: "Проект не в статусе спора" };
  }
  if (project.contract.status !== "ESCROWED") {
    return { error: "Средства уже обработаны" };
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
    await createUserNotification({
      userId: project.clientId,
      type: "USER_WARNING",
      title: "Спор решён частично",
      body:
        stripeRefundedAmount > 0
          ? `Вам возвращено ${stripeRefundedAmount.toLocaleString("uk-UA")} через Stripe по проекту «${project.title}».`
          : `На баланс возвращено ${clientRefund.toLocaleString("uk-UA")} по проекту «${project.title}».`,
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
  if (!projectId) return { error: "Проект не найден" };

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { contract: true },
  });

  if (!project) return { error: "Проект не найден" };

  if (
    project.contract &&
    (project.contract.status === "ESCROWED" ||
      project.contract.status === "AWAITING_FUNDING")
  ) {
    return {
      error:
        "Нельзя закрыть проект с активным эскроу. Сначала завершите или разрешите спор.",
    };
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
