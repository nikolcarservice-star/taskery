"use client";

import {
  adminCloseProject,
  adminRefundDispute,
  adminReleaseDispute,
  type ActionState,
} from "@/lib/actions/admin";
import { AdminAttentionPanel } from "@/components/AdminAttentionPanel";
import { AdminReportsPanel } from "@/components/AdminReportsPanel";
import { AdminFinancePanel } from "@/components/AdminFinancePanel";
import { AdminUsersPanel } from "@/components/AdminUsersPanel";
import {
  AdminStaffManager,
  type AdminStaffMember,
} from "@/components/AdminStaffManager";
import {
  hasAdminPermission,
} from "@/lib/admin-permissions";
import type { ModerationAttentionItem } from "@/lib/queries/admin-attention";
import type { AdminFinanceOverview } from "@/lib/queries/admin-finance";
import type { AdminUserItem } from "@/lib/queries/admin-users";
import type { AdminPermission } from "@/generated/prisma/client";
import {
  formatBudget,
} from "@/lib/project-labels";
import { contractStatusLabels } from "@/lib/contract-labels";
import { useActionState } from "react";

type DisputeProject = {
  id: string;
  title: string;
  status: string;
  currency: string;
  client: { name: string | null; email: string };
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
};

const initialState: ActionState = {};

function DisputeActions({ projectId }: { projectId: string }) {
  const [releaseState, releaseAction, releasePending] = useActionState(
    adminReleaseDispute,
    initialState,
  );
  const [refundState, refundAction, refundPending] = useActionState(
    adminRefundDispute,
    initialState,
  );

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <form action={releaseAction}>
        <input type="hidden" name="projectId" value={projectId} />
        <button
          type="submit"
          disabled={releasePending}
          className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          Выплатить исполнителю
        </button>
      </form>
      <form action={refundAction}>
        <input type="hidden" name="projectId" value={projectId} />
        <button
          type="submit"
          disabled={refundPending}
          className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Вернуть заказчику
        </button>
      </form>
      {(releaseState.error || refundState.error) && (
        <p className="w-full text-xs text-red-600">
          {releaseState.error || refundState.error}
        </p>
      )}
      {(releaseState.success || refundState.success) && (
        <p className="w-full text-xs text-green-700">Спор решён</p>
      )}
    </div>
  );
}

function CloseProjectButton({ projectId }: { projectId: string }) {
  const [state, formAction, pending] = useActionState(
    adminCloseProject,
    initialState,
  );

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="projectId" value={projectId} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-zinc-500 underline hover:text-zinc-800"
      >
        Закрыть
      </button>
      {state.success && (
        <span className="ml-2 text-xs text-green-700">OK</span>
      )}
    </form>
  );
}

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
}: AdminPanelProps) {
  const canModerate = hasAdminPermission(permissions, "MODERATION");
  const canManageStaff = hasAdminPermission(permissions, "STAFF_MANAGE");
  const canViewUsers = hasAdminPermission(permissions, "USERS");
  const canViewFinance = hasAdminPermission(permissions, "FINANCE");

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

      {canModerate && <AdminAttentionPanel items={attentionItems} />}

      {canModerate && <AdminReportsPanel reports={reports} />}

      {canModerate && (
      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-900">
          Споры ({disputes.length})
        </h2>
        {disputes.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">Активных споров нет</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {disputes.map((project) => (
              <li
                key={project.id}
                className="rounded-xl border border-red-100 bg-red-50 p-4"
              >
                <p className="font-medium text-zinc-900">{project.title}</p>
                {project.contract && (
                  <>
                    <p className="mt-1 text-sm text-zinc-600">
                      {formatBudget(project.contract.amount, project.currency)} ·{" "}
                      {contractStatusLabels[
                        project.contract.status as keyof typeof contractStatusLabels
                      ]}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Заказчик: {project.client.name ?? project.client.email} ·
                      Исполнитель:{" "}
                      {project.contract.freelancer.name ??
                        project.contract.freelancer.email}
                    </p>
                    <DisputeActions projectId={project.id} />
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      )}

      {canModerate && (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">
          Открытые проекты ({openProjects.length})
        </h2>
        {openProjects.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">Нет открытых проектов</p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100">
            {openProjects.map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <a
                    href={`/projects/${project.slug}`}
                    className="font-medium text-zinc-900 hover:text-blue-600"
                  >
                    {project.title}
                  </a>
                  <p className="text-xs text-zinc-500">
                    {project.client.name ?? "Заказчик"}
                  </p>
                </div>
                <CloseProjectButton projectId={project.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
      )}

      {canViewUsers && <AdminUsersPanel users={users} />}

      {canViewFinance && finance && <AdminFinancePanel finance={finance} />}
    </div>
  );
}
