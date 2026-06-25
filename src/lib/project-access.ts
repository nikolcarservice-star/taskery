import type { ProjectStatus } from "@/generated/prisma/client";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { prisma } from "@/lib/prisma";

/** Admins with MODERATION permission may preview projects awaiting approval. */
export async function canModerationAdminViewPendingProject(
  userId: string | undefined,
  projectStatus: ProjectStatus,
): Promise<boolean> {
  if (!userId || projectStatus !== "PENDING_MODERATION") {
    return false;
  }

  const admin = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, adminActive: true, adminPermissions: true },
  });

  if (!admin || admin.role !== "ADMIN" || !admin.adminActive) {
    return false;
  }

  return hasAdminPermission(admin.adminPermissions, "MODERATION");
}
