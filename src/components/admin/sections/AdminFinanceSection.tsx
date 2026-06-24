"use client";

import { AdminFinancePanel } from "@/components/AdminFinancePanel";
import { AdminWithdrawalsPanel } from "@/components/AdminWithdrawalsPanel";
import { AdminTabNav } from "@/components/admin/AdminTabNav";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AdminFinanceOverview } from "@/lib/queries/admin-finance";
import type { AdminWithdrawalItem } from "@/lib/queries/admin-withdrawals";
import type { AppLocale } from "@/lib/i18n/types";
import { useRouter, useSearchParams } from "next/navigation";

type FinanceSectionKey = "withdrawals" | "overview";

type AdminFinanceSectionProps = {
  finance: AdminFinanceOverview;
  pendingWithdrawals: AdminWithdrawalItem[];
  locale: AppLocale;
  basePath?: string;
};

export function AdminFinanceSection({
  finance,
  pendingWithdrawals,
  locale,
  basePath = "/admin/finance",
}: AdminFinanceSectionProps) {
  const copy = getAdminCopy(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const activeSection: FinanceSectionKey =
    sectionParam === "overview" ? "overview" : "withdrawals";

  function setSection(section: FinanceSectionKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (section === "withdrawals") {
      params.delete("section");
    } else {
      params.set("section", section);
    }
    const query = params.toString();
    router.replace(query ? `${basePath}?${query}` : basePath, {
      scroll: false,
    });
  }

  return (
    <div className="space-y-5">
      <AdminTabNav
        size="sm"
        ariaLabel={copy.tabNavAria}
        tabs={[
          {
            id: "withdrawals" as const,
            label: copy.financeSections.withdrawals,
            badge: pendingWithdrawals.length,
          },
          { id: "overview" as const, label: copy.financeSections.overview },
        ]}
        active={activeSection}
        onChange={setSection}
      />
      {activeSection === "withdrawals" ? (
        <AdminWithdrawalsPanel withdrawals={pendingWithdrawals} />
      ) : (
        <AdminFinancePanel finance={finance} />
      )}
    </div>
  );
}
