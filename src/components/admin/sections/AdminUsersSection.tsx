"use client";

import { AdminTabNav } from "@/components/admin/AdminTabNav";
import { AdminUsersPanel } from "@/components/AdminUsersPanel";
import { AdminVerificationPanel } from "@/components/AdminVerificationPanel";
import type { AdminUserItem } from "@/lib/queries/admin-users";
import type { AdminVerificationItem } from "@/lib/queries/admin-verification";
import { useRouter, useSearchParams } from "next/navigation";

type UsersSectionKey = "verification" | "accounts";

type AdminUsersSectionProps = {
  verificationItems: AdminVerificationItem[];
  users: AdminUserItem[];
  basePath?: string;
};

export function AdminUsersSection({
  verificationItems,
  users,
  basePath = "/admin/users",
}: AdminUsersSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const activeSection: UsersSectionKey =
    sectionParam === "accounts" ? "accounts" : "verification";

  function setSection(section: UsersSectionKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (section === "verification") {
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
        tabs={[
          {
            id: "verification" as const,
            label: "Верификация",
            badge: verificationItems.length,
          },
          { id: "accounts" as const, label: "Аккаунты" },
        ]}
        active={activeSection}
        onChange={setSection}
      />
      {activeSection === "verification" ? (
        <AdminVerificationPanel items={verificationItems} />
      ) : (
        <AdminUsersPanel users={users} />
      )}
    </div>
  );
}
