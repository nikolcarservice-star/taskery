"use server";

import { auth } from "@/lib/auth";
import { hasAdminPermission } from "@/lib/admin-permissions";
import {
  EscrowError,
  atomicRefundContract,
  atomicReleaseDispute,
} from "@/lib/escrow-ops";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionState = {
  error?: string;
  success?: boolean;
};

async function requireAdminSession(permission?: Parameters<typeof hasAdminPermission>[1]) {
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
  return "Не удалось выполнить операцию";
}

export async function adminReleaseDispute(
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

  revalidatePath("/admin");
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

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { contract: true },
  });

  if (!project?.contract) return { error: "Сделка не найдена" };

  if (project.status !== "UNDER_DISPUTE") {
    return { error: "Проект не в статусе спора" };
  }

  if (project.contract.status !== "ESCROWED") {
    return { error: "Средства уже обработаны" };
  }

  const amount = Number(project.contract.amount);

  try {
    await atomicRefundContract(
      project.contract.id,
      projectId,
      project.clientId,
      amount,
    );
  } catch (error) {
    return { error: escrowErrorMessage(error) };
  }

  revalidatePath("/admin");
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

  revalidatePath("/admin");
  revalidatePath(`/projects/${projectId}`);

  return { success: true };
}
