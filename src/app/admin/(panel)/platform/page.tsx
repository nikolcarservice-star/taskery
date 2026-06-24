import { AdminPlatformSection } from "@/components/admin/sections/AdminPlatformSection";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { getAdminCatalogOverview } from "@/lib/queries/admin-catalog";
import { getCmsPages } from "@/lib/queries/admin-cms";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminPlatformPage() {
  const { permissions } = await getAdminPageContext("/admin/platform");

  if (!hasAdminPermission(permissions, "STAFF_MANAGE")) {
    redirect("/admin/overview");
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
        catalogCategories={catalogOverview?.categories ?? []}
        catalogSkills={catalogOverview?.skills ?? []}
        cmsPages={cmsPages}
        stats={{ freelancers: freelancerCount, clients: clientCount }}
      />
    </Suspense>
  );
}
