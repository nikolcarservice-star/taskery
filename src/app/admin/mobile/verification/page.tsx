import { AdminVerificationPanel } from "@/components/AdminVerificationPanel";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getPendingProfileVerifications } from "@/lib/queries/admin-verification";
import { redirect } from "next/navigation";

export default async function AdminMobileVerificationPage() {
  const { permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/verification`,
  );

  if (!hasAdminPermission(permissions, "USERS")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const items = await getPendingProfileVerifications();

  return <AdminVerificationPanel items={items} compact />;
}
