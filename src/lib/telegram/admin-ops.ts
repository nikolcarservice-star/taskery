import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { publishProjectAfterApproval } from "@/lib/actions/admin-project-moderation";
import { createLocalizedUserNotification } from "@/lib/create-user-notification";
import { formatMoney } from "@/lib/i18n/currencies";
import { prisma } from "@/lib/prisma";
import { transferWithdrawalToConnect } from "@/lib/stripe-connect";
import type { ResolvedAdmin } from "@/lib/telegram/resolve";
import {
  atomicApproveWithdrawal,
  atomicRejectWithdrawal,
  WithdrawalError,
} from "@/lib/withdrawal-ops";
import { revalidatePath } from "next/cache";

export type TelegramOpResult = { ok: true } | { ok: false; error: string };

export type TelegramListResult =
  | { ok: false; error: string }
  | { ok: true; text: string };

function requirePermission(
  admin: ResolvedAdmin,
  permission: "MODERATION" | "FINANCE",
): { ok: false; error: string } | null {
  if (!hasAdminPermission(admin.adminPermissions, permission)) {
    return { ok: false, error: "Недостаточно прав" };
  }
  return null;
}

export async function telegramApproveProject(
  admin: ResolvedAdmin,
  projectId: string,
): Promise<TelegramOpResult> {
  const denied = requirePermission(admin, "MODERATION");
  if (denied) return denied;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, status: true, slug: true, clientId: true, title: true },
  });

  if (!project || project.status !== "PENDING_MODERATION") {
    return { ok: false, error: "Проект не на модерации" };
  }

  await publishProjectAfterApproval(project, { adminId: admin.id });
  return { ok: true };
}

export async function telegramRejectProject(
  admin: ResolvedAdmin,
  projectId: string,
  reason = "Проект не прошёл модерацию",
): Promise<TelegramOpResult> {
  const denied = requirePermission(admin, "MODERATION");
  if (denied) return denied;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, status: true, clientId: true, title: true },
  });

  if (!project || project.status !== "PENDING_MODERATION") {
    return { ok: false, error: "Проект не на модерации" };
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      status: "CLOSED",
      moderationNote: reason,
    },
  });

  await createLocalizedUserNotification({
    userId: project.clientId,
    type: "USER_WARNING",
    template: "PROJECT_REJECTED",
    variables: { projectTitle: project.title, reason },
    link: `/client/projects`,
  });

  await logAdminAction(admin.id, "PROJECT_REJECT", {
    targetType: "project",
    targetId: projectId,
    details: { reason, source: "telegram" },
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/client/projects");
  return { ok: true };
}

export async function telegramApproveWithdrawal(
  admin: ResolvedAdmin,
  paymentId: string,
): Promise<TelegramOpResult> {
  const denied = requirePermission(admin, "FINANCE");
  if (denied) return denied;

  try {
    const payment = await atomicApproveWithdrawal(paymentId, admin.id);

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

    await logAdminAction(admin.id, "WITHDRAWAL_APPROVE", {
      targetType: "payment",
      targetId: paymentId,
      details: { userId: payment.userId, amount: Number(payment.amount), source: "telegram" },
    });
  } catch (error) {
    if (error instanceof WithdrawalError) {
      return { ok: false, error: error.message };
    }
    throw error;
  }

  revalidatePath("/admin/finance");
  revalidatePath("/admin/mobile/withdrawals");
  return { ok: true };
}

export async function telegramRejectWithdrawal(
  admin: ResolvedAdmin,
  paymentId: string,
  reason = "Заявка отклонена администратором",
): Promise<TelegramOpResult> {
  const denied = requirePermission(admin, "FINANCE");
  if (denied) return denied;

  try {
    const payment = await atomicRejectWithdrawal(paymentId, admin.id, reason);

    await createLocalizedUserNotification({
      userId: payment.userId,
      type: "USER_WARNING",
      template: "WITHDRAWAL_REJECTED",
      variables: { reason },
      link: "/dashboard/finances?tab=withdrawals",
    });

    await logAdminAction(admin.id, "WITHDRAWAL_REJECT", {
      targetType: "payment",
      targetId: paymentId,
      details: {
        userId: payment.userId,
        amount: Number(payment.amount),
        reason,
        source: "telegram",
      },
    });
  } catch (error) {
    if (error instanceof WithdrawalError) {
      return { ok: false, error: error.message };
    }
    throw error;
  }

  revalidatePath("/admin/finance");
  revalidatePath("/admin/mobile/withdrawals");
  return { ok: true };
}

export async function telegramListPendingProjects(
  admin: ResolvedAdmin,
): Promise<TelegramListResult> {
  const denied = requirePermission(admin, "MODERATION");
  if (denied) return denied;

  const projects = await prisma.project.findMany({
    where: { status: "PENDING_MODERATION" },
    select: { id: true, title: true, createdAt: true },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  if (projects.length === 0) {
    return { ok: true, text: "Нет проектов на модерации." };
  }

  const lines = projects.map(
    (p, i) => `${i + 1}. ${p.title}`,
  );
  return {
    ok: true,
    text: `Проекты на модерации (${projects.length}):\n\n${lines.join("\n")}`,
  };
}

export async function telegramListPendingWithdrawals(
  admin: ResolvedAdmin,
): Promise<TelegramListResult> {
  const denied = requirePermission(admin, "FINANCE");
  if (denied) return denied;

  const payments = await prisma.payment.findMany({
    where: { type: "WITHDRAWAL", status: "PENDING" },
    select: { id: true, amount: true, currency: true, createdAt: true },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  if (payments.length === 0) {
    return { ok: true, text: "Нет заявок на вывод." };
  }

  const lines = payments.map((p, i) => {
    const amount = formatMoney(Number(p.amount), p.currency);
    return `${i + 1}. ${amount}`;
  });
  return {
    ok: true,
    text: `Заявки на вывод (${payments.length}):\n\n${lines.join("\n")}`,
  };
}

export async function telegramListPendingReports(
  admin: ResolvedAdmin,
): Promise<TelegramListResult> {
  const denied = requirePermission(admin, "MODERATION");
  if (denied) return denied;

  const count = await prisma.report.count({
    where: { status: { in: ["PENDING", "IN_REVIEW"] } },
  });

  return {
    ok: true,
    text:
      count === 0
        ? "Нет открытых жалоб."
        : `Открытых жалоб: ${count}. Откройте /admin/moderation`,
  };
}

export function telegramHelpText(admin: ResolvedAdmin) {
  const lines = ["Команды Taskery Admin Bot:", "/help — эта справка"];

  if (hasAdminPermission(admin.adminPermissions, "MODERATION")) {
    lines.push("/pending — проекты на модерации");
    lines.push("/reports — жалобы");
  }
  if (hasAdminPermission(admin.adminPermissions, "FINANCE")) {
    lines.push("/withdrawals — заявки на вывод");
  }

  lines.push("\nДействия также доступны через кнопки в уведомлениях.");
  return lines.join("\n");
}
