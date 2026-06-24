import { AdminFinanceSection } from "@/components/admin/sections/AdminFinanceSection";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getAdminFinanceOverview } from "@/lib/queries/admin-finance";
import { getPendingWithdrawals } from "@/lib/queries/admin-withdrawals";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminMobileFinancePage() {
  const { permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/finance`,
  );

  if (!hasAdminPermission(permissions, "FINANCE")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const [finance, pendingWithdrawals] = await Promise.all([
    getAdminFinanceOverview(),
    getPendingWithdrawals(),
  ]);

  if (!finance) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-zinc-100" />}>
      <AdminFinanceSection
        basePath={`${ADMIN_MOBILE_ROOT}/finance`}
        finance={finance}
        pendingWithdrawals={pendingWithdrawals}
      />
    </Suspense>
  );
}
