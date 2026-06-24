import { AdminModerationStack } from "@/components/AdminModerationStack";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getContentModerationQueue } from "@/lib/queries/admin-content-moderation";
import { getPendingModerationProjects } from "@/lib/queries/admin-pending-projects";
import { getModerationAttentionItems } from "@/lib/queries/admin-attention";
import { getPendingAdminReports } from "@/lib/queries/admin-reports";
import { getAdminSupportTickets } from "@/lib/queries/admin-support";
import { getLocale } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminMobileModerationPage() {
  const { permissions, admin } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/moderation`,
  );

  if (!hasAdminPermission(permissions, "MODERATION")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const locale = await getLocale();

  const [
    attentionItems,
    reports,
    disputes,
    openProjects,
    pendingProjects,
    contentModeration,
    supportTickets,
  ] = await Promise.all([
    getModerationAttentionItems(admin.id),
    getPendingAdminReports(),
    prisma.project.findMany({
      where: { status: "UNDER_DISPUTE" },
      include: {
        client: { select: { name: true, email: true } },
        conversation: { select: { id: true } },
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
    getPendingModerationProjects(),
    getContentModerationQueue(),
    getAdminSupportTickets(),
  ]);

  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-zinc-100" />}>
      <AdminModerationStack
        layout="tabs"
        syncSectionToUrl
        compact
        locale={locale}
        moderationBasePath={`${ADMIN_MOBILE_ROOT}/moderation`}
        moderationBackHref={`${ADMIN_MOBILE_ROOT}/moderation`}
        attentionItems={attentionItems}
        reports={reports}
        disputes={disputes}
        openProjects={openProjects}
        pendingProjects={pendingProjects}
        contentModeration={contentModeration}
        supportTickets={supportTickets}
      />
    </Suspense>
  );
}
