import { AdminFinancePanel } from "@/components/AdminFinancePanel";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getAdminFinanceOverview } from "@/lib/queries/admin-finance";
import { redirect } from "next/navigation";

export default async function AdminMobileFinancePage() {
  const { permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/finance`,
  );

  if (!hasAdminPermission(permissions, "FINANCE")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const finance = await getAdminFinanceOverview();

  return <AdminFinancePanel finance={finance} mobile />;
}
