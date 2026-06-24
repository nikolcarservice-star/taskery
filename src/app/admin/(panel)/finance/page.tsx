import { AdminFinanceSection } from "@/components/admin/sections/AdminFinanceSection";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { getLocale } from "@/lib/i18n/server";
import { getAdminFinanceOverview } from "@/lib/queries/admin-finance";
import { getPendingWithdrawals } from "@/lib/queries/admin-withdrawals";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminFinancePage() {
  const { permissions } = await getAdminPageContext("/admin/finance");

  if (!hasAdminPermission(permissions, "FINANCE")) {
    redirect("/admin/overview");
  }

  const locale = await getLocale();

  const [finance, pendingWithdrawals] = await Promise.all([
    getAdminFinanceOverview(),
    getPendingWithdrawals(locale),
  ]);

  if (!finance) {
    redirect("/admin/overview");
  }

  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-zinc-100" />}>
      <AdminFinanceSection
        finance={finance}
        pendingWithdrawals={pendingWithdrawals}
        locale={locale}
      />
    </Suspense>
  );
}
