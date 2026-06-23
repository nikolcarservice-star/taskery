import { AdminModerationStack } from "@/components/AdminModerationStack";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getModerationAttentionItems } from "@/lib/queries/admin-attention";
import { getPendingAdminReports } from "@/lib/queries/admin-reports";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminMobileModerationPage() {
  const { permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/moderation`,
  );

  if (!hasAdminPermission(permissions, "MODERATION")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const [attentionItems, reports, disputes, openProjects] = await Promise.all([
    getModerationAttentionItems(),
    getPendingAdminReports(),
    prisma.project.findMany({
      where: { status: "UNDER_DISPUTE" },
      include: {
        client: { select: { name: true, email: true } },
        contract: {
          include: {
            freelancer: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.project.findMany({
      where: { status: "OPEN" },
      select: {
        id: true,
        slug: true,
        title: true,
        client: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <AdminModerationStack
      attentionItems={attentionItems}
      reports={reports}
      disputes={disputes}
      openProjects={openProjects}
      compact
    />
  );
}
