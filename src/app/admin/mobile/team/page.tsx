import { AdminTeamSection } from "@/components/admin/sections/AdminTeamSection";
import { hasAdminPermission, isSuperAdmin } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getRecentAdminAuditLogs } from "@/lib/admin-audit";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminMobileTeamPage() {
  const { permissions, admin } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/team`,
  );

  if (!hasAdminPermission(permissions, "STAFF_MANAGE")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const canViewAudit =
    hasAdminPermission(permissions, "STAFF_MANAGE") ||
    isSuperAdmin(permissions);

  const [admins, auditLogs] = await Promise.all([
    prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        name: true,
        email: true,
        adminPermissions: true,
        adminActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    canViewAudit ? getRecentAdminAuditLogs(30) : Promise.resolve([]),
  ]);

  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-zinc-100" />}>
      <AdminTeamSection
        basePath={`${ADMIN_MOBILE_ROOT}/team`}
        admins={admins.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
        }))}
        currentAdminId={admin.id}
        auditLogs={auditLogs}
        showAudit={canViewAudit && auditLogs.length > 0}
      />
    </Suspense>
  );
}
