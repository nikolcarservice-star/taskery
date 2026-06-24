"use client";

import { AdminAnalyticsPanel } from "@/components/AdminAnalyticsPanel";
import { AdminAuditPanel } from "@/components/AdminAuditPanel";
import { AdminBroadcastPanel } from "@/components/AdminBroadcastPanel";
import { AdminCatalogPanel } from "@/components/AdminCatalogPanel";
import { AdminCmsPanel } from "@/components/AdminCmsPanel";
import { AdminFinancePanel } from "@/components/AdminFinancePanel";
import { AdminModerationStack } from "@/components/AdminModerationStack";
import { AdminUsersPanel } from "@/components/AdminUsersPanel";
import { AdminVerificationPanel } from "@/components/AdminVerificationPanel";
import { AdminWithdrawalsPanel } from "@/components/AdminWithdrawalsPanel";
import {
  AdminStaffManager,
  type AdminStaffMember,
} from "@/components/AdminStaffManager";
import { AdminTabNav } from "@/components/admin/AdminTabNav";
import {
  getVisibleAdminTabs,
  resolveAdminTab,
  type AdminTabKey,
} from "@/lib/admin-tabs";
import {
  hasAdminPermission,
  isSuperAdmin,
} from "@/lib/admin-permissions";
import type { ModerationAttentionItem } from "@/lib/queries/admin-attention";
import type { AdminAnalyticsOverview } from "@/lib/queries/admin-analytics";
import type { ContentModerationOverview } from "@/lib/queries/admin-content-moderation";
import type { CmsPageItem } from "@/lib/queries/admin-cms";
import type { PendingProjectItem } from "@/lib/queries/admin-pending-projects";
import type { AdminFinanceOverview } from "@/lib/queries/admin-finance";
import type { AdminUserItem } from "@/lib/queries/admin-users";
import type { AdminAuditEntry } from "@/lib/admin-audit-types";
import type { AdminWithdrawalItem } from "@/lib/queries/admin-withdrawals";
import type { AdminSupportTicketItem } from "@/lib/queries/admin-support";
import type { AdminVerificationItem } from "@/lib/queries/admin-verification";
import type { AdminCategoryItem, AdminSkillItem } from "@/lib/queries/admin-catalog";
import type { AdminPermission } from "@/generated/prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type DisputeProject = {
  id: string;
  title: string;
  status: string;
  currency: string;
  client: { name: string | null; email: string };
  conversation: { id: string } | null;
  contract: {
    id: string;
    amount: { toString(): string };
    status: string;
    freelancer: { name: string | null; email: string };
  } | null;
};

type AdminPanelProps = {
  disputes: DisputeProject[];
  openProjects: { id: string; slug: string; title: string; client: { name: string | null } }[];
  reports: import("@/lib/reports-shared").AdminReportItem[];
  attentionItems: ModerationAttentionItem[];
  stats: {
    users: number;
    projects: number;
    freelancers: number;
    clients: number;
  };
  permissions: AdminPermission[];
  admins: AdminStaffMember[];
  currentAdminId: string;
  users: AdminUserItem[];
  finance: AdminFinanceOverview | null;
  analytics: AdminAnalyticsOverview | null;
  auditLogs: AdminAuditEntry[];
  supportTickets: AdminSupportTicketItem[];
  verificationItems: AdminVerificationItem[];
  catalogCategories: AdminCategoryItem[];
  catalogSkills: AdminSkillItem[];
  pendingWithdrawals: AdminWithdrawalItem[];
  pendingProjects: PendingProjectItem[];
  contentModeration: ContentModerationOverview;
  cmsPages: CmsPageItem[];
};

type UsersSectionKey = "verification" | "accounts";
type FinanceSectionKey = "withdrawals" | "overview";
type PlatformSectionKey = "catalog" | "cms" | "broadcast";
type TeamSectionKey = "staff" | "audit";

export function AdminPanel({
  disputes,
  openProjects,
  reports,
  attentionItems,
  stats,
  permissions,
  admins,
  currentAdminId,
  users,
  finance,
  analytics,
  auditLogs,
  supportTickets,
  verificationItems,
  catalogCategories,
  catalogSkills,
  pendingWithdrawals,
  pendingProjects,
  contentModeration,
  cmsPages,
}: AdminPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const visibleTabs = getVisibleAdminTabs(permissions);
  const activeTab = resolveAdminTab(searchParams.get("tab"), permissions);

  const canModerate = hasAdminPermission(permissions, "MODERATION");
  const canManageStaff = hasAdminPermission(permissions, "STAFF_MANAGE");
  const canViewUsers = hasAdminPermission(permissions, "USERS");
  const canViewFinance = hasAdminPermission(permissions, "FINANCE");
  const canViewAudit = canManageStaff || isSuperAdmin(permissions);

  const openSupportCount = supportTickets.filter((ticket) =>
    ["OPEN", "IN_PROGRESS"].includes(ticket.status),
  ).length;
  const contentCount =
    contentModeration.portfolio.length + contentModeration.avatars.length;

  const tabBadges = useMemo(
    () => ({
      overview: 0,
      moderation:
        attentionItems.length +
        reports.length +
        disputes.length +
        pendingProjects.length +
        contentCount +
        openSupportCount,
      users: verificationItems.length,
      finance: pendingWithdrawals.length,
      platform: 0,
      team: 0,
    }),
    [
      attentionItems.length,
      reports.length,
      disputes.length,
      pendingProjects.length,
      contentCount,
      openSupportCount,
      verificationItems.length,
      pendingWithdrawals.length,
    ],
  );

  const [usersSection, setUsersSection] = useState<UsersSectionKey>(
    verificationItems.length > 0 ? "verification" : "accounts",
  );
  const [financeSection, setFinanceSection] = useState<FinanceSectionKey>(
    pendingWithdrawals.length > 0 ? "withdrawals" : "overview",
  );
  const [platformSection, setPlatformSection] =
    useState<PlatformSectionKey>("catalog");
  const [teamSection, setTeamSection] = useState<TeamSectionKey>("staff");

  function setTab(tab: AdminTabKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === visibleTabs[0]?.id) {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.replace(query ? `/admin?${query}` : "/admin", { scroll: false });
  }

  const activeTabMeta = visibleTabs.find((tab) => tab.id === activeTab);

  return (
    <div className="space-y-6">
      <AdminTabNav
        tabs={visibleTabs.map((tab) => ({
          id: tab.id,
          label: tab.label,
          badge: tabBadges[tab.id],
        }))}
        active={activeTab}
        onChange={setTab}
      />

      {activeTabMeta && (
        <p className="text-sm text-zinc-500">{activeTabMeta.description}</p>
      )}

      <div className="min-h-[320px]">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Пользователей", value: stats.users },
                { label: "Заказчиков", value: stats.clients },
                { label: "Фрилансеров", value: stats.freelancers },
                { label: "Проектов", value: stats.projects },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </section>

            {canViewFinance && analytics && (
              <AdminAnalyticsPanel analytics={analytics} />
            )}

            {!canModerate &&
              !canManageStaff &&
              !canViewUsers &&
              !canViewFinance && (
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
                  У вашего аккаунта нет назначенных функций. Обратитесь к
                  супер-администратору.
                </section>
              )}
          </div>
        )}

        {activeTab === "moderation" && canModerate && (
          <AdminModerationStack
            layout="tabs"
            attentionItems={attentionItems}
            reports={reports}
            disputes={disputes}
            openProjects={openProjects}
            pendingProjects={pendingProjects}
            contentModeration={contentModeration}
            supportTickets={supportTickets}
            moderationBackHref="/admin?tab=moderation"
          />
        )}

        {activeTab === "users" && canViewUsers && (
          <div className="space-y-5">
            <AdminTabNav
              size="sm"
              tabs={[
                {
                  id: "verification" as const,
                  label: "Верификация",
                  badge: verificationItems.length,
                },
                {
                  id: "accounts" as const,
                  label: "Аккаунты",
                },
              ]}
              active={usersSection}
              onChange={setUsersSection}
            />
            {usersSection === "verification" ? (
              <AdminVerificationPanel items={verificationItems} />
            ) : (
              <AdminUsersPanel users={users} />
            )}
          </div>
        )}

        {activeTab === "finance" && canViewFinance && finance && (
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
              active={financeSection}
              onChange={setFinanceSection}
            />
            {financeSection === "withdrawals" ? (
              <AdminWithdrawalsPanel withdrawals={pendingWithdrawals} />
            ) : (
              <AdminFinancePanel finance={finance} />
            )}
          </div>
        )}

        {activeTab === "platform" && canManageStaff && (
          <div className="space-y-5">
            <AdminTabNav
              size="sm"
              tabs={[
                { id: "catalog" as const, label: "Каталог" },
                { id: "cms" as const, label: "CMS" },
                { id: "broadcast" as const, label: "Рассылка" },
              ]}
              active={platformSection}
              onChange={setPlatformSection}
            />
            {platformSection === "catalog" && (
              <AdminCatalogPanel
                categories={catalogCategories}
                skills={catalogSkills}
              />
            )}
            {platformSection === "cms" && <AdminCmsPanel pages={cmsPages} />}
            {platformSection === "broadcast" && (
              <AdminBroadcastPanel
                stats={{
                  freelancers: stats.freelancers,
                  clients: stats.clients,
                }}
              />
            )}
          </div>
        )}

        {activeTab === "team" && canManageStaff && (
          <div className="space-y-5">
            {canViewAudit && auditLogs.length > 0 ? (
              <>
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
                  active={teamSection}
                  onChange={setTeamSection}
                />
                {teamSection === "staff" ? (
                  <AdminStaffManager
                    admins={admins}
                    currentAdminId={currentAdminId}
                  />
                ) : (
                  <AdminAuditPanel entries={auditLogs} />
                )}
              </>
            ) : (
              <AdminStaffManager
                admins={admins}
                currentAdminId={currentAdminId}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
