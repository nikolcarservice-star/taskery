import { AdminFinancePanel } from "@/components/AdminFinancePanel";
import { AdminWithdrawalsPanel } from "@/components/AdminWithdrawalsPanel";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getAdminFinanceOverview } from "@/lib/queries/admin-finance";
import { getPendingWithdrawals } from "@/lib/queries/admin-withdrawals";
import { redirect } from "next/navigation";

export default async function AdminMobileFinancePage() {
  const { permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/finance`,
  );

  if (!hasAdminPermission(permissions, "FINANCE")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const [finance, withdrawals] = await Promise.all([
    getAdminFinanceOverview(),
    getPendingWithdrawals(),
  ]);

  return (
    <div className="space-y-4">
      <AdminWithdrawalsPanel withdrawals={withdrawals} compact />
      <AdminFinancePanel finance={finance} mobile />
    </div>
  );
}
