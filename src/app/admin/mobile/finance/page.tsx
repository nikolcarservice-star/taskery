import { AdminAnalyticsPanel } from "@/components/AdminAnalyticsPanel";
import { AdminFinancePanel } from "@/components/AdminFinancePanel";
import { AdminWithdrawalsPanel } from "@/components/AdminWithdrawalsPanel";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getAdminAnalyticsOverview } from "@/lib/queries/admin-analytics";
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

  const [finance, withdrawals, analytics] = await Promise.all([
    getAdminFinanceOverview(),
    getPendingWithdrawals(),
    getAdminAnalyticsOverview(),
  ]);

  return (
    <div className="space-y-4">
      <AdminAnalyticsPanel analytics={analytics} mobile />
      <AdminWithdrawalsPanel withdrawals={withdrawals} compact />
      <AdminFinancePanel finance={finance} mobile />
    </div>
  );
}
