"use client";

import { AdminFinancePanel } from "@/components/AdminFinancePanel";
import { AdminWithdrawalsPanel } from "@/components/AdminWithdrawalsPanel";
import { AdminTabNav } from "@/components/admin/AdminTabNav";
import type { AdminFinanceOverview } from "@/lib/queries/admin-finance";
import type { AdminWithdrawalItem } from "@/lib/queries/admin-withdrawals";
import { useRouter, useSearchParams } from "next/navigation";

type FinanceSectionKey = "withdrawals" | "overview";

type AdminFinanceSectionProps = {
  finance: AdminFinanceOverview;
  pendingWithdrawals: AdminWithdrawalItem[];
};

export function AdminFinanceSection({
  finance,
  pendingWithdrawals,
}: AdminFinanceSectionProps) {
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
    router.replace(query ? `/admin/finance?${query}` : "/admin/finance", {
      scroll: false,
    });
  }

  return (
    <div className="space-y-5">
      <AdminTabNav
        size="sm"
        tabs={[
          {
            id: "withdrawals" as const,
            label: "Выводы",
            badge: pendingWithdrawals.length,
          },
          { id: "overview" as const, label: "Обзор" },
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
