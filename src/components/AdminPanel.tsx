"use client";

import { AdminModerationStack } from "@/components/AdminModerationStack";
import { AdminFinancePanel } from "@/components/AdminFinancePanel";
import { AdminAuditPanel } from "@/components/AdminAuditPanel";
import { AdminBroadcastPanel } from "@/components/AdminBroadcastPanel";
import { AdminCatalogPanel } from "@/components/AdminCatalogPanel";
import { AdminVerificationPanel } from "@/components/AdminVerificationPanel";
import { AdminSupportPanel } from "@/components/AdminSupportPanel";
import { AdminUsersPanel } from "@/components/AdminUsersPanel";
import {
  AdminStaffManager,
  type AdminStaffMember,
} from "@/components/AdminStaffManager";
import {
  hasAdminPermission,
  isSuperAdmin,
} from "@/lib/admin-permissions";
import type { ModerationAttentionItem } from "@/lib/queries/admin-attention";
import type { AdminFinanceOverview } from "@/lib/queries/admin-finance";
import type { AdminUserItem } from "@/lib/queries/admin-users";
import type { AdminAuditEntry } from "@/lib/admin-audit-types";
import { AdminWithdrawalsPanel } from "@/components/AdminWithdrawalsPanel";
import type { AdminWithdrawalItem } from "@/lib/queries/admin-withdrawals";
import type { AdminSupportTicketItem } from "@/lib/queries/admin-support";
import type { AdminVerificationItem } from "@/lib/queries/admin-verification";
import type { AdminCategoryItem, AdminSkillItem } from "@/lib/queries/admin-catalog";
import type { AdminPermission } from "@/generated/prisma/client";

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
  auditLogs: AdminAuditEntry[];
  supportTickets: AdminSupportTicketItem[];
  verificationItems: AdminVerificationItem[];
  catalogCategories: AdminCategoryItem[];
  catalogSkills: AdminSkillItem[];
  pendingWithdrawals: AdminWithdrawalItem[];
};

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
  auditLogs,
  supportTickets,
  verificationItems,
  catalogCategories,
  catalogSkills,
  pendingWithdrawals,
}: AdminPanelProps) {
  const canModerate = hasAdminPermission(permissions, "MODERATION");
  const canManageStaff = hasAdminPermission(permissions, "STAFF_MANAGE");
  const canViewUsers = hasAdminPermission(permissions, "USERS");
  const canViewFinance = hasAdminPermission(permissions, "FINANCE");
  const canViewAudit = canManageStaff || isSuperAdmin(permissions);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Пользователей", value: stats.users },
          { label: "Заказчиков", value: stats.clients },
          { label: "Фрилансеров", value: stats.freelancers },
          { label: "Проектов", value: stats.projects },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs text-zinc-500">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">{item.value}</p>
          </div>
        ))}
      </section>

      {!canModerate && !canManageStaff && !canViewUsers && !canViewFinance && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          У вашего аккаунта нет назначенных функций. Обратитесь к
          супер-администратору.
        </section>
      )}

      {canManageStaff && (
        <AdminStaffManager admins={admins} currentAdminId={currentAdminId} />
      )}

      {canModerate && (
        <AdminModerationStack
          attentionItems={attentionItems}
          reports={reports}
          disputes={disputes}
          openProjects={openProjects}
        />
      )}

      {canModerate && (
        <AdminSupportPanel tickets={supportTickets} />
      )}

      {canViewUsers && (
        <>
          <AdminVerificationPanel items={verificationItems} />
          <AdminUsersPanel users={users} />
        </>
      )}

      {canManageStaff && (
        <>
          <AdminBroadcastPanel
            stats={{
              freelancers: stats.freelancers,
              clients: stats.clients,
            }}
          />
          <AdminCatalogPanel
            categories={catalogCategories}
            skills={catalogSkills}
          />
        </>
      )}

      {canViewFinance && finance && (
        <>
          <AdminWithdrawalsPanel withdrawals={pendingWithdrawals} />
          <AdminFinancePanel finance={finance} />
        </>
      )}

      {canViewAudit && auditLogs.length > 0 && (
        <AdminAuditPanel entries={auditLogs} />
      )}
    </div>
  );
}
