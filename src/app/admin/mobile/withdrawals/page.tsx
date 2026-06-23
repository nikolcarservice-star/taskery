import { AdminWithdrawalsPanel } from "@/components/AdminWithdrawalsPanel";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getPendingWithdrawals } from "@/lib/queries/admin-withdrawals";
import { redirect } from "next/navigation";

export default async function AdminMobileWithdrawalsPage() {
  const { permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/withdrawals`,
  );

  if (!hasAdminPermission(permissions, "FINANCE")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const withdrawals = await getPendingWithdrawals();

  return <AdminWithdrawalsPanel withdrawals={withdrawals} compact />;
}
