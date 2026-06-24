"use server";

import { actionError } from "@/lib/action-errors";
import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { createLocalizedUserNotification } from "@/lib/create-user-notification";
import { formatMoney } from "@/lib/i18n/currencies";
import { prisma } from "@/lib/prisma";
import { transferWithdrawalToConnect } from "@/lib/stripe-connect";
import {
  atomicApproveWithdrawal,
  atomicRejectWithdrawal,
  WithdrawalError,
} from "@/lib/withdrawal-ops";
import { revalidatePath } from "next/cache";

export type FinanceOpsState = {
  error?: string;
  success?: boolean;
};

async function requireFinanceAdmin() {
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

  if (!hasAdminPermission(admin.adminPermissions, "FINANCE")) {
    return actionError("ADMIN_INSUFFICIENT_PERMISSION");
  }

  return { admin } as const;
}

export async function adminAdjustBalance(
  _prevState: FinanceOpsState,
  formData: FormData,
): Promise<FinanceOpsState> {
  const authResult = await requireFinanceAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  const amountRaw = (formData.get("amount") as string | null)?.trim();
  const reason =
    (formData.get("reason") as string | null)?.trim() ||
    "Корректировка баланса администратором";

  if (!userId) return actionError("USER_NOT_FOUND");

  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount === 0) {
    return actionError("BALANCE_ADJUSTMENT_NONZERO");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, deletedAt: true, balance: true },
  });

  if (!user || user.deletedAt) return actionError("USER_NOT_FOUND");

  const currentBalance = Number(user.balance);
  if (amount < 0 && currentBalance + amount < 0) {
    return actionError("BALANCE_CANNOT_GO_NEGATIVE");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
    }),
    prisma.payment.create({
      data: {
        userId,
        amount: Math.abs(amount),
        type: "ADMIN_ADJUSTMENT",
        status: "COMPLETED",
        metadata: {
          reason,
          adminId: authResult.admin.id,
          direction: amount > 0 ? "credit" : "debit",
        },
      },
    }),
  ]);

  await logAdminAction(authResult.admin.id, "BALANCE_ADJUST", {
    targetType: "user",
    targetId: userId,
    details: { amount, reason },
  });

  const formattedAmount = formatMoney(Math.abs(amount), "UAH");
  await createLocalizedUserNotification({
    userId,
    type: "USER_WARNING",
    template: amount > 0 ? "BALANCE_ADJUSTED_CREDIT" : "BALANCE_ADJUSTED_DEBIT",
    variables: { amount: formattedAmount, reason },
    link: user.role === "CLIENT" ? "/client/finances" : "/dashboard/finances",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/finance");
  revalidatePath("/admin/mobile/users");
  return { success: true };
}

export async function adminApproveWithdrawal(
  _prevState: FinanceOpsState,
  formData: FormData,
): Promise<FinanceOpsState> {
  const authResult = await requireFinanceAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const paymentId = (formData.get("paymentId") as string | null)?.trim();
  if (!paymentId) return actionError("WITHDRAWAL_NOT_FOUND");

  try {
    const payment = await atomicApproveWithdrawal(
      paymentId,
      authResult.admin.id,
    );

    let stripeTransferId: string | null = null;
    try {
      const transfer = await transferWithdrawalToConnect(
        payment.userId,
        Number(payment.amount),
        paymentId,
      );
      stripeTransferId = transfer?.transferId ?? null;
    } catch (transferError) {
      console.error("Stripe Connect transfer failed:", transferError);
    }

    if (stripeTransferId) {
      const existingMeta =
        typeof payment.metadata === "object" && payment.metadata
          ? (payment.metadata as Record<string, unknown>)
          : {};
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          metadata: {
            ...existingMeta,
            stripeTransferId,
            payoutMethod: "stripe_connect",
          },
        },
      });
    }

    const formattedAmount = formatMoney(
      Number(payment.amount),
      payment.currency,
    );

    await createLocalizedUserNotification({
      userId: payment.userId,
      type: "USER_WARNING",
      template: stripeTransferId
        ? "WITHDRAWAL_APPROVED_STRIPE"
        : "WITHDRAWAL_APPROVED_MANUAL",
      variables: { amount: formattedAmount },
      link: "/dashboard/finances?tab=withdrawals",
    });

    await logAdminAction(authResult.admin.id, "WITHDRAWAL_APPROVE", {
      targetType: "payment",
      targetId: paymentId,
      details: { userId: payment.userId, amount: Number(payment.amount) },
    });
  } catch (error) {
    if (error instanceof WithdrawalError) {
      return { error: error.message };
    }
    throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/finance");
  revalidatePath("/admin/mobile/withdrawals");
  return { success: true };
}

export async function adminRejectWithdrawal(
  _prevState: FinanceOpsState,
  formData: FormData,
): Promise<FinanceOpsState> {
  const authResult = await requireFinanceAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const paymentId = (formData.get("paymentId") as string | null)?.trim();
  const reason =
    (formData.get("reason") as string | null)?.trim() ||
    "Заявка отклонена администратором";

  if (!paymentId) return actionError("WITHDRAWAL_NOT_FOUND");

  try {
    const payment = await atomicRejectWithdrawal(
      paymentId,
      authResult.admin.id,
      reason,
    );

    await createLocalizedUserNotification({
      userId: payment.userId,
      type: "USER_WARNING",
      template: "WITHDRAWAL_REJECTED",
      variables: { reason },
      link: "/dashboard/finances?tab=withdrawals",
    });

    await logAdminAction(authResult.admin.id, "WITHDRAWAL_REJECT", {
      targetType: "payment",
      targetId: paymentId,
      details: {
        userId: payment.userId,
        amount: Number(payment.amount),
        reason,
      },
    });
  } catch (error) {
    if (error instanceof WithdrawalError) {
      return { error: error.message };
    }
    throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/finance");
  revalidatePath("/admin/mobile/withdrawals");
  return { success: true };
}
