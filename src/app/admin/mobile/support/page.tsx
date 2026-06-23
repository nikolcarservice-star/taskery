import { AdminSupportPanel } from "@/components/AdminSupportPanel";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getAdminSupportTickets } from "@/lib/queries/admin-support";
import { redirect } from "next/navigation";

export default async function AdminMobileSupportPage() {
  const { permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/support`,
  );

  if (!hasAdminPermission(permissions, "MODERATION")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const tickets = await getAdminSupportTickets();

  return <AdminSupportPanel tickets={tickets} compact />;
}
