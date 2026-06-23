"use client";

import {
  adminCloseProject,
  adminRefundDispute,
  adminReleaseDispute,
  type ActionState,
} from "@/lib/actions/admin";
import { AdminAttentionPanel } from "@/components/AdminAttentionPanel";
import { AdminReportsPanel } from "@/components/AdminReportsPanel";
import type { ModerationAttentionItem } from "@/lib/queries/admin-attention";
import { formatBudget } from "@/lib/project-labels";
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

type AdminModerationStackProps = {
  attentionItems: ModerationAttentionItem[];
  reports: import("@/lib/reports-shared").AdminReportItem[];
  disputes: DisputeProject[];
  openProjects: {
    id: string;
    slug: string;
    title: string;
    client: { name: string | null };
  }[];
  compact?: boolean;
  moderationBackHref?: string;
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
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <form action={releaseAction} className="flex-1 sm:flex-none">
        <input type="hidden" name="projectId" value={projectId} />
        <button
          type="submit"
          disabled={releasePending}
          className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white active:bg-green-700 disabled:opacity-50 sm:w-auto"
        >
          Выплатить исполнителю
        </button>
      </form>
      <form action={refundAction} className="flex-1 sm:flex-none">
        <input type="hidden" name="projectId" value={projectId} />
        <button
          type="submit"
          disabled={refundPending}
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white active:bg-blue-700 disabled:opacity-50 sm:w-auto"
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
    <form action={formAction}>
      <input type="hidden" name="projectId" value={projectId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-700 active:bg-zinc-50 disabled:opacity-50"
      >
        Закрыть
      </button>
      {state.success && (
        <span className="ml-2 text-xs text-green-700">OK</span>
      )}
    </form>
  );
}

export function AdminModerationStack({
  attentionItems,
  reports,
  disputes,
  openProjects,
  compact = false,
  moderationBackHref = "/admin",
}: AdminModerationStackProps) {
  const gap = compact ? "space-y-4" : "space-y-10";

  return (
    <div className={gap}>
      <AdminAttentionPanel
        items={attentionItems}
        moderationBackHref={moderationBackHref}
      />
      <AdminReportsPanel reports={reports} />

      <section className="rounded-2xl border border-red-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-red-900 sm:text-lg">
          Споры ({disputes.length})
        </h2>
        {disputes.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">Активных споров нет</p>
        ) : (
          <ul className="mt-4 space-y-3">
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
                      {project.client.name ?? project.client.email} ·{" "}
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

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">
          Открытые проекты ({openProjects.length})
        </h2>
        {openProjects.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">Нет открытых проектов</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {openProjects.map((project) => (
              <li
                key={project.id}
                className="flex flex-col gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
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
    </div>
  );
}
