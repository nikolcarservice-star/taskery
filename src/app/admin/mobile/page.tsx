import { AdminOverviewSection } from "@/components/admin/sections/AdminOverviewSection";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { getAdminAnalyticsOverview } from "@/lib/queries/admin-analytics";
import { getAdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import { prisma } from "@/lib/prisma";

export default async function AdminMobileOverviewPage() {
  const { permissions, admin } = await getAdminPageContext("/admin/mobile");
  const canViewFinance = hasAdminPermission(permissions, "FINANCE");

  const [userCount, projectCount, freelancerCount, clientCount, analytics, badges] =
    await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.user.count({ where: { role: "FREELANCER" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      canViewFinance
        ? getAdminAnalyticsOverview()
        : Promise.resolve(null),
      getAdminMobileBadges(permissions, admin.id),
    ]);

  return (
    <AdminOverviewSection
      platform="mobile"
      stats={{
        users: userCount,
        projects: projectCount,
        freelancers: freelancerCount,
        clients: clientCount,
      }}
      permissions={permissions}
      analytics={analytics}
      badges={badges}
    />
  );
}
