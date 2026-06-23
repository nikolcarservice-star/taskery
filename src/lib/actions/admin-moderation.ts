"use server";

import { auth } from "@/lib/auth";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { prisma } from "@/lib/prisma";
import { recalculateProjectReportStats } from "@/lib/report-stats";
import { revalidatePath } from "next/cache";

export type ModerationActionState = {
  error?: string;
  success?: boolean;
};

async function requireModerationAdmin() {
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

  if (!hasAdminPermission(admin.adminPermissions, "MODERATION")) {
    return { error: "Недостаточно прав" } as const;
  }

  return { session, admin } as const;
}

async function resolveReportById(
  reportId: string,
  adminId: string,
  status: "RESOLVED" | "DISMISSED",
  adminNote?: string,
) {
  const report = await prisma.report.update({
    where: { id: reportId },
    data: {
      status,
      resolvedById: adminId,
      resolvedAt: new Date(),
      adminNote: adminNote ?? null,
    },
    select: { targetProjectId: true },
  });

  if (report.targetProjectId) {
    await recalculateProjectReportStats(report.targetProjectId);
  }
}

export async function adminDismissReport(
  _prevState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const reportId = (formData.get("reportId") as string | null)?.trim();
  if (!reportId) return { error: "Жалоба не найдена" };

  const note = (formData.get("adminNote") as string | null)?.trim() || undefined;

  try {
    await resolveReportById(reportId, authResult.admin.id, "DISMISSED", note);
  } catch {
    return { error: "Жалоба не найдена" };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function adminDismissProjectReports(
  _prevState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const projectId = (formData.get("projectId") as string | null)?.trim();
  if (!projectId) return { error: "Проект не найден" };

  const note = (formData.get("adminNote") as string | null)?.trim() || undefined;

  await prisma.report.updateMany({
    where: {
      targetProjectId: projectId,
      status: { in: ["PENDING", "IN_REVIEW"] },
    },
    data: {
      status: "DISMISSED",
      resolvedById: authResult.admin.id,
      resolvedAt: new Date(),
      adminNote: note ?? null,
    },
  });

  await recalculateProjectReportStats(projectId);

  revalidatePath("/admin");
  return { success: true };
}

export async function adminDismissUserReports(
  _prevState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  if (!userId) return { error: "Пользователь не найден" };

  const note = (formData.get("adminNote") as string | null)?.trim() || undefined;

  await prisma.report.updateMany({
    where: {
      targetUserId: userId,
      status: { in: ["PENDING", "IN_REVIEW"] },
    },
    data: {
      status: "DISMISSED",
      resolvedById: authResult.admin.id,
      resolvedAt: new Date(),
      adminNote: note ?? null,
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function adminBlockProject(
  _prevState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const projectId = (formData.get("projectId") as string | null)?.trim();
  const reportId = (formData.get("reportId") as string | null)?.trim();
  const reason =
    (formData.get("adminNote") as string | null)?.trim() ||
    "Заблокировано модератором";

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
        "Нельзя заблокировать проект с активным эскроу. Сначала завершите или разрешите спор.",
    };
  }

  await prisma.$transaction([
    prisma.project.update({
      where: { id: projectId },
      data: {
        status: "CLOSED",
        blockedAt: new Date(),
        blockReason: reason,
        hiddenFromCatalog: true,
        moderationHot: false,
      },
    }),
    prisma.report.updateMany({
      where: {
        targetProjectId: projectId,
        status: { in: ["PENDING", "IN_REVIEW"] },
      },
      data: {
        status: "RESOLVED",
        resolvedById: authResult.admin.id,
        resolvedAt: new Date(),
        adminNote: reason,
      },
    }),
  ]);

  if (reportId) {
    try {
      await resolveReportById(reportId, authResult.admin.id, "RESOLVED", reason);
    } catch {
      // already resolved in batch
    }
  }

  await recalculateProjectReportStats(projectId);

  revalidatePath("/admin");
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/projects");

  return { success: true };
}

export async function adminBanUser(
  _prevState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  const reportId = (formData.get("reportId") as string | null)?.trim();
  const reason =
    (formData.get("adminNote") as string | null)?.trim() ||
    "Заблокирован модератором";

  if (!userId) return { error: "Пользователь не найден" };
  if (userId === authResult.admin.id) {
    return { error: "Нельзя заблокировать свой аккаунт" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) return { error: "Пользователь не найден" };
  if (user.role === "ADMIN") {
    return { error: "Нельзя заблокировать администратора" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { bannedAt: new Date(), banReason: reason },
    }),
    prisma.project.updateMany({
      where: {
        clientId: userId,
        status: "OPEN",
        blockedAt: null,
      },
      data: {
        status: "CLOSED",
        blockedAt: new Date(),
        blockReason: reason,
        hiddenFromCatalog: true,
      },
    }),
    prisma.report.updateMany({
      where: {
        OR: [{ targetUserId: userId }, { targetProject: { clientId: userId } }],
        status: { in: ["PENDING", "IN_REVIEW"] },
      },
      data: {
        status: "RESOLVED",
        resolvedById: authResult.admin.id,
        resolvedAt: new Date(),
        adminNote: reason,
      },
    }),
  ]);

  if (reportId) {
    try {
      await resolveReportById(reportId, authResult.admin.id, "RESOLVED", reason);
    } catch {
      // ignore
    }
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function adminDeleteUser(
  _prevState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const userId = (formData.get("userId") as string | null)?.trim();
  const reportId = (formData.get("reportId") as string | null)?.trim();
  const reason =
    (formData.get("adminNote") as string | null)?.trim() ||
    "Удалён модератором";

  if (!userId) return { error: "Пользователь не найден" };
  if (userId === authResult.admin.id) {
    return { error: "Нельзя удалить свой аккаунт" };
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

  if (!user) return { error: "Пользователь не найден" };
  if (user.role === "ADMIN") {
    return { error: "Нельзя удалить администратора" };
  }

  const activeContracts =
    user.contractsAsClient.length + user.contractsAsFreelancer.length;
  if (activeContracts > 0) {
    return {
      error:
        "Нельзя удалить пользователя с активными эскроу-сделками. Сначала завершите сделки.",
    };
  }

  const anonymizedEmail = `deleted+${user.id}@taskery.local`;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        bannedAt: new Date(),
        banReason: reason,
        email: anonymizedEmail,
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
    prisma.report.updateMany({
      where: {
        OR: [{ targetUserId: userId }, { targetProject: { clientId: userId } }],
        status: { in: ["PENDING", "IN_REVIEW"] },
      },
      data: {
        status: "RESOLVED",
        resolvedById: authResult.admin.id,
        resolvedAt: new Date(),
        adminNote: reason,
      },
    }),
  ]);

  if (reportId) {
    try {
      await resolveReportById(reportId, authResult.admin.id, "RESOLVED", reason);
    } catch {
      // ignore
    }
  }

  revalidatePath("/admin");
  return { success: true };
}
