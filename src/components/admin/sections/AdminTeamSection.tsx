"use client";

import { AdminAuditPanel } from "@/components/AdminAuditPanel";
import {
  AdminStaffManager,
  type AdminStaffMember,
} from "@/components/AdminStaffManager";
import { AdminTabNav } from "@/components/admin/AdminTabNav";
import type { AdminAuditEntry } from "@/lib/admin-audit-types";
import { useRouter, useSearchParams } from "next/navigation";

type TeamSectionKey = "staff" | "audit";

type AdminTeamSectionProps = {
  admins: AdminStaffMember[];
  currentAdminId: string;
  auditLogs: AdminAuditEntry[];
  showAudit: boolean;
};

export function AdminTeamSection({
  admins,
  currentAdminId,
  auditLogs,
  showAudit,
}: AdminTeamSectionProps) {
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
    router.replace(query ? `/admin/team?${query}` : "/admin/team", {
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
        tabs={[
          { id: "staff" as const, label: "Администраторы" },
          {
            id: "audit" as const,
            label: "Журнал",
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
