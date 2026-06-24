"use server";

import { actionError } from "@/lib/action-errors";
import { logAdminAction } from "@/lib/admin-audit";
import { notifyAdminsWithPermission } from "@/lib/admin-notify";
import { requireModerationAdmin } from "@/lib/actions/admin-moderation";
import { createLocalizedUserNotification } from "@/lib/create-user-notification";
import { prisma } from "@/lib/prisma";
import { notifyFreelancersAboutNewProject } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export type ProjectModerationState = { error?: string; success?: boolean };

type PublishableProject = {
  id: string;
  slug: string;
  clientId: string;
  title: string;
};

export async function publishProjectAfterApproval(
  project: PublishableProject,
  options?: { adminId?: string },
) {
  await prisma.project.update({
    where: { id: project.id },
    data: {
      status: "OPEN",
      moderationNote: null,
    },
  });

  await notifyFreelancersAboutNewProject(project.id);

  await createLocalizedUserNotification({
    userId: project.clientId,
    type: "USER_WARNING",
    template: options?.adminId ? "PROJECT_PUBLISHED_MODERATED" : "PROJECT_PUBLISHED",
    variables: { projectTitle: project.title },
    link: `/projects/${project.slug}`,
  });

  if (options?.adminId) {
    await logAdminAction(options.adminId, "PROJECT_APPROVE", {
      targetType: "project",
      targetId: project.id,
    });
  }

  revalidatePath("/admin/moderation");
  revalidatePath("/admin/mobile/moderation");
  revalidatePath("/projects");
  revalidatePath("/contests");
  revalidatePath("/client/projects");
  revalidatePath(`/projects/${project.slug}`);
}

export async function adminApproveProject(
  _prevState: ProjectModerationState,
  formData: FormData,
): Promise<ProjectModerationState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const projectId = (formData.get("projectId") as string | null)?.trim();
  if (!projectId) return actionError("PROJECT_NOT_FOUND");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, status: true, slug: true, clientId: true, title: true },
  });

  if (!project || project.status !== "PENDING_MODERATION") {
    return actionError("PROJECT_NOT_IN_MODERATION");
  }

  await publishProjectAfterApproval(project, { adminId: authResult.admin.id });
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

  if (!projectId) return actionError("PROJECT_NOT_FOUND");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, status: true, slug: true, clientId: true, title: true },
  });

  if (!project || project.status !== "PENDING_MODERATION") {
    return actionError("PROJECT_NOT_IN_MODERATION");
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

  await logAdminAction(authResult.admin.id, "PROJECT_REJECT", {
    targetType: "project",
    targetId: projectId,
    details: { reason },
  });

  revalidatePath("/admin/moderation");
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
    template: "ADMIN_PROJECT_PENDING",
    variables: { projectTitle: title },
    link: "/admin/moderation",
    metadata: { projectId },
  });
}
