"use client";

import { AdminAuditPanel } from "@/components/AdminAuditPanel";
import {
  AdminStaffManager,
  type AdminStaffMember,
} from "@/components/AdminStaffManager";
import { AdminTabNav } from "@/components/admin/AdminTabNav";
import type { AdminAuditEntry } from "@/lib/admin-audit-types";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AppLocale } from "@/lib/i18n/types";
import { useRouter, useSearchParams } from "next/navigation";

type TeamSectionKey = "staff" | "audit";

type AdminTeamSectionProps = {
  admins: AdminStaffMember[];
  currentAdminId: string;
  auditLogs: AdminAuditEntry[];
  showAudit: boolean;
  locale: AppLocale;
  basePath?: string;
};

export function AdminTeamSection({
  admins,
  currentAdminId,
  auditLogs,
  showAudit,
  locale,
  basePath = "/admin/team",
}: AdminTeamSectionProps) {
  const copy = getAdminCopy(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const activeSection: TeamSectionKey =
    sectionParam === "audit" && showAudit ? "audit" : "staff";

  function setSection(section: TeamSectionKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (section === "staff") {
      params.delete("section");
    } else {
      params.set("section", section);
    }
    const query = params.toString();
    router.replace(query ? `${basePath}?${query}` : basePath, {
      scroll: false,
    });
  }

  if (!showAudit) {
    return (
      <AdminStaffManager admins={admins} currentAdminId={currentAdminId} />
    );
  }

  return (
    <div className="space-y-5">
      <AdminTabNav
        size="sm"
        ariaLabel={copy.tabNavAria}
        tabs={[
          { id: "staff" as const, label: copy.teamSections.staff },
          {
            id: "audit" as const,
            label: copy.teamSections.audit,
            badge: auditLogs.length,
          },
        ]}
        active={activeSection}
        onChange={setSection}
      />
      {activeSection === "staff" ? (
        <AdminStaffManager admins={admins} currentAdminId={currentAdminId} />
      ) : (
        <AdminAuditPanel entries={auditLogs} />
      )}
    </div>
  );
}
