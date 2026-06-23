import { AdminCatalogPanel } from "@/components/AdminCatalogPanel";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getAdminCatalogOverview } from "@/lib/queries/admin-catalog";
import { redirect } from "next/navigation";

export default async function AdminMobileCatalogPage() {
  const { permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/catalog`,
  );

  if (!hasAdminPermission(permissions, "STAFF_MANAGE")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const { categories, skills } = await getAdminCatalogOverview();

  return (
    <AdminCatalogPanel categories={categories} skills={skills} compact />
  );
}
