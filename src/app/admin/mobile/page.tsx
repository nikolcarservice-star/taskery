import { AdminMobileHome } from "@/components/admin/mobile/AdminMobileHome";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { getAdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import { prisma } from "@/lib/prisma";

export default async function AdminMobileHomePage() {
  const { permissions } = await getAdminPageContext("/admin/mobile");
  const [badges, userCount, projectCount, freelancerCount, clientCount] =
    await Promise.all([
      getAdminMobileBadges(permissions),
      prisma.user.count(),
      prisma.project.count(),
      prisma.user.count({ where: { role: "FREELANCER" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
    ]);

  return (
    <AdminMobileHome
      permissions={permissions}
      badges={badges}
      stats={{
        users: userCount,
        projects: projectCount,
        freelancers: freelancerCount,
        clients: clientCount,
      }}
    />
  );
}
