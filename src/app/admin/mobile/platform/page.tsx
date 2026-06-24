import { AdminPlatformSection } from "@/components/admin/sections/AdminPlatformSection";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getAdminCatalogOverview } from "@/lib/queries/admin-catalog";
import { getCmsPages } from "@/lib/queries/admin-cms";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminMobilePlatformPage() {
  const { permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/platform`,
  );

  if (!hasAdminPermission(permissions, "STAFF_MANAGE")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const [catalogOverview, cmsPages, freelancerCount, clientCount] =
    await Promise.all([
      getAdminCatalogOverview(),
      getCmsPages(),
      prisma.user.count({ where: { role: "FREELANCER" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
    ]);

  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-zinc-100" />}>
      <AdminPlatformSection
        basePath={`${ADMIN_MOBILE_ROOT}/platform`}
        catalogCategories={catalogOverview?.categories ?? []}
        catalogSkills={catalogOverview?.skills ?? []}
        cmsPages={cmsPages}
        stats={{ freelancers: freelancerCount, clients: clientCount }}
      />
    </Suspense>
  );
}
