import { AdminCmsPanel } from "@/components/AdminCmsPanel";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getCmsPages } from "@/lib/queries/admin-cms";
import { redirect } from "next/navigation";

export default async function AdminMobileCmsPage() {
  const { permissions } = await getAdminPageContext(`${ADMIN_MOBILE_ROOT}/cms`);

  if (!hasAdminPermission(permissions, "STAFF_MANAGE")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const cmsPages = await getCmsPages();

  return <AdminCmsPanel pages={cmsPages} compact />;
}
