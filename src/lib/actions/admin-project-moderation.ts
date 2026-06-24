"use server";

import { logAdminAction } from "@/lib/admin-audit";
import { notifyAdminsWithPermission } from "@/lib/admin-notify";
import { requireModerationAdmin } from "@/lib/actions/admin-moderation";
import { prisma } from "@/lib/prisma";
import { notifyFreelancersAboutNewProject } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export type ProjectModerationState = { error?: string; success?: boolean };

export async function adminApproveProject(
  _prevState: ProjectModerationState,
  formData: FormData,
): Promise<ProjectModerationState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const projectId = (formData.get("projectId") as string | null)?.trim();
  if (!projectId) return { error: "Проект не найден" };

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, status: true, slug: true, clientId: true, title: true },
  });

  if (!project || project.status !== "PENDING_MODERATION") {
    return { error: "Проект не в очереди модерации" };
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      status: "OPEN",
      moderationNote: null,
    },
  });

  await notifyFreelancersAboutNewProject(projectId);

  await prisma.notification.create({
    data: {
      userId: project.clientId,
      type: "USER_WARNING",
      title: "Проект опубликован",
      body: `«${project.title}» прошёл модерацию и доступен в каталоге.`,
      link: `/projects/${project.slug}`,
    },
  });

  await logAdminAction(authResult.admin.id, "PROJECT_APPROVE", {
    targetType: "project",
    targetId: projectId,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/moderation");
  revalidatePath("/projects");
  revalidatePath("/client/projects");
  return { success: true };
}

export async function adminRejectProject(
  _prevState: ProjectModerationState,
  formData: FormData,
): Promise<ProjectModerationState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const projectId = (formData.get("projectId") as string | null)?.trim();
  const reason =
    (formData.get("reason") as string | null)?.trim() ||
    "Проект не прошёл модерацию";

  if (!projectId) return { error: "Проект не найден" };

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, status: true, slug: true, clientId: true, title: true },
  });

  if (!project || project.status !== "PENDING_MODERATION") {
    return { error: "Проект не в очереди модерации" };
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      status: "CLOSED",
      moderationNote: reason,
    },
  });

  await prisma.notification.create({
    data: {
      userId: project.clientId,
      type: "USER_WARNING",
      title: "Проект отклонён",
      body: `«${project.title}»: ${reason}`,
      link: `/client/projects`,
    },
  });

  await logAdminAction(authResult.admin.id, "PROJECT_REJECT", {
    targetType: "project",
    targetId: projectId,
    details: { reason },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/moderation");
  revalidatePath("/client/projects");
  return { success: true };
}

export async function notifyAdminsNewProjectPending(
  projectId: string,
  title: string,
) {
  await notifyAdminsWithPermission("MODERATION", {
    type: "ADMIN_PROJECT_PENDING",
    title: "Проект на модерации",
    body: title,
    link: "/admin",
    metadata: { projectId },
    emailSubject: "Новый проект на модерации",
  });
}
