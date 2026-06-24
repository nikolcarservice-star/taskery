import { AdminOverviewSection } from "@/components/admin/sections/AdminOverviewSection";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { getLocale } from "@/lib/i18n/server";
import { getAdminAnalyticsOverview } from "@/lib/queries/admin-analytics";
import { getAdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { permissions, admin } = await getAdminPageContext("/admin/overview");
  const { days: daysParam } = await searchParams;
  const analyticsDays = Math.min(
    Math.max(Number.parseInt(daysParam ?? "30", 10) || 30, 7),
    90,
  );

  const canViewFinance = hasAdminPermission(permissions, "FINANCE");

  const locale = await getLocale();

  const [userCount, projectCount, freelancerCount, clientCount, analytics, badges] =
    await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.user.count({ where: { role: "FREELANCER" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      canViewFinance
        ? getAdminAnalyticsOverview(analyticsDays)
        : Promise.resolve(null),
      getAdminMobileBadges(permissions, admin.id),
    ]);

  return (
    <AdminOverviewSection
      locale={locale}
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
