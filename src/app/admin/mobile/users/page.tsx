import { AdminUsersPanel } from "@/components/AdminUsersPanel";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getAdminUsers } from "@/lib/queries/admin-users";
import { redirect } from "next/navigation";

export default async function AdminMobileUsersPage() {
  const { permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/users`,
  );

  if (!hasAdminPermission(permissions, "USERS")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const users = await getAdminUsers();

  return <AdminUsersPanel users={users} mobile />;
}
