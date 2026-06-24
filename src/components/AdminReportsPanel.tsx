"use client";

import {
  adminBanUser,
  adminBlockProject,
  adminDeleteUser,
  adminDismissProjectReports,
  adminDismissUserReports,
  adminResolveReportNoAction,
  adminTakeReportReview,
  type ModerationActionState,
} from "@/lib/actions/admin-moderation";
import { getAdminCopy } from "@/lib/admin-i18n";
import { adminReportObjectsLabel } from "@/lib/admin-i18n-panels";
import type {
  AdminReportItem,
  AdminReportProjectGroup,
  AdminReportUserGroup,
} from "@/lib/reports-shared";
import { formatBudget } from "@/lib/project-labels";
import {
  getOtherReportCount,
  groupAdminReports,
  UNDERPRICED_REPORT_THRESHOLD,
} from "@/lib/reports-shared";
import type { AppLocale } from "@/lib/i18n/types";
import { useActionState } from "react";

const initialState: ModerationActionState = {};

function ReportRow({
  report,
  locale,
}: {
  report: AdminReportItem;
  locale: AppLocale;
}) {
  const r = getAdminCopy(locale).panels.reports;
  const [reviewState, reviewAction, reviewPending] = useActionState(
    adminTakeReportReview,
    initialState,
  );

  return (
    <li className="rounded-lg border border-orange-100/80 bg-white px-3 py-2.5 text-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-orange-50 px-2 py-0.5 font-medium text-orange-800">
          {r.reasons[report.reason] ?? report.reason}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 font-medium ${
            report.status === "IN_REVIEW"
              ? "bg-blue-100 text-blue-800"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {r.statuses[report.status] ?? report.status}
        </span>
        <span className="text-zinc-500">
          {new Date(report.createdAt).toLocaleString(locale)}
        </span>
      </div>
      <p className="mt-1.5 text-zinc-800">
        {report.reporter.name ?? report.reporter.email}
      </p>
      {report.details && (
        <p className="mt-1 text-xs leading-5 text-zinc-600">{report.details}</p>
      )}
      {report.status === "PENDING" && (
        <form action={reviewAction} className="mt-2">
          <input type="hidden" name="reportId" value={report.id} />
          <button
            type="submit"
            disabled={reviewPending}
            className="rounded-full border border-blue-300 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50"
          >
            {reviewPending ? "…" : r.takeReview}
          </button>
        </form>
      )}
      {report.status === "IN_REVIEW" && (
        <ResolveReportForm reportId={report.id} locale={locale} />
      )}
      {reviewState.error && (
        <p className="mt-1 text-xs text-red-600">{reviewState.error}</p>
      )}
    </li>
  );
}

function ResolveReportForm({
  reportId,
  locale,
}: {
  reportId: string;
  locale: AppLocale;
}) {
  const r = getAdminCopy(locale).panels.reports;
  const [state, formAction, pending] = useActionState(
    adminResolveReportNoAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-2 flex flex-wrap items-center gap-2">
      <input type="hidden" name="reportId" value={reportId} />
      <input
        name="adminNote"
        placeholder={r.commentPlaceholder}
        className="min-w-[140px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-emerald-300 px-3 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
      >
        {r.resolveNoSanctions}
      </button>
      {state.error && <p className="w-full text-xs text-red-600">{state.error}</p>}
    </form>
  );
}

function ProjectGroupActions({
  group,
  locale,
}: {
  group: AdminReportProjectGroup;
  locale: AppLocale;
}) {
  const r = getAdminCopy(locale).panels.reports;
  const c = getAdminCopy(locale).panels.common;
  const [dismissState, dismissAction, dismissPending] = useActionState(
    adminDismissProjectReports,
    initialState,
  );
  const [blockState, blockAction, blockPending] = useActionState(
    adminBlockProject,
    initialState,
  );
  const [banState, banAction, banPending] = useActionState(
    adminBanUser,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    adminDeleteUser,
    initialState,
  );

  const clientId = group.project.client.id;
  const error =
    dismissState.error ||
    blockState.error ||
    banState.error ||
    deleteState.error;
  const success =
    dismissState.success ||
    blockState.success ||
    banState.success ||
    deleteState.success;

  return (
    <div className="mt-4 space-y-2 border-t border-orange-100 pt-4">
      <form action={dismissAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="projectId" value={group.project.id} />
        <input
          name="adminNote"
          placeholder={r.dismissAllNote}
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={dismissPending}
          className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          {r.dismissAll} ({group.reports.length})
        </button>
      </form>

      <form action={blockAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="projectId" value={group.project.id} />
        <input
          name="adminNote"
          placeholder={r.blockProjectReason}
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={blockPending}
          className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {r.blockProject}
        </button>
      </form>

      <form action={banAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="userId" value={clientId} />
        <input
          name="adminNote"
          placeholder={r.blockClientReason}
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={banPending}
          className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {r.blockClient}
        </button>
      </form>

      <form action={deleteAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="userId" value={clientId} />
        <input
          name="adminNote"
          placeholder={r.deleteClientReason}
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={deletePending}
          className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {r.deleteClient}
        </button>
      </form>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-700">{c.done}</p>}
    </div>
  );
}

function UserGroupActions({
  group,
  locale,
}: {
  group: AdminReportUserGroup;
  locale: AppLocale;
}) {
  const r = getAdminCopy(locale).panels.reports;
  const c = getAdminCopy(locale).panels.common;
  const [dismissState, dismissAction, dismissPending] = useActionState(
    adminDismissUserReports,
    initialState,
  );
  const [banState, banAction, banPending] = useActionState(
    adminBanUser,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    adminDeleteUser,
    initialState,
  );

  const error =
    dismissState.error || banState.error || deleteState.error;
  const success =
    dismissState.success || banState.success || deleteState.success;

  return (
    <div className="mt-4 space-y-2 border-t border-orange-100 pt-4">
      <form action={dismissAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="userId" value={group.user.id} />
        <input
          name="adminNote"
          placeholder={r.dismissAllNote}
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={dismissPending}
          className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          {r.dismissAll} ({group.reports.length})
        </button>
      </form>

      <form action={banAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="userId" value={group.user.id} />
        <input
          name="adminNote"
          placeholder={r.blockUserReason}
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={banPending}
          className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {r.blockUser}
        </button>
      </form>

      <form action={deleteAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="userId" value={group.user.id} />
        <input
          name="adminNote"
          placeholder={r.deleteUserReason}
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={deletePending}
          className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {r.deleteUser}
        </button>
      </form>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-700">{c.done}</p>}
    </div>
  );
}

function ProjectReportGroupCard({
  group,
  locale,
}: {
  group: AdminReportProjectGroup;
  locale: AppLocale;
}) {
  const r = getAdminCopy(locale).panels.reports;
  const c = getAdminCopy(locale).panels.common;
  const threshold = UNDERPRICED_REPORT_THRESHOLD;
  const project = group.project;
  const underpriced = project.underpricedReportCount;
  const otherCount = getOtherReportCount(project.reportCount, underpriced);
  const underpricedInQueue = group.reports.filter(
    (item) => item.reason === "UNDERPRICED",
  ).length;
  const barPercent = Math.min(
    100,
    Math.round((Math.min(underpriced, threshold) / threshold) * 100),
  );

  return (
    <li
      className={`rounded-xl border p-4 ${
        project.moderationHot
          ? "border-red-200 bg-red-50/50"
          : "border-orange-200 bg-orange-50/40"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-900">
              {r.projectGroup} · {group.reports.length} {r.reportsWord}
            </span>
            {project.moderationHot && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                {r.inReview}
              </span>
            )}
          </div>

          <a
            href={`/projects/${project.slug}`}
            className="mt-2 block text-base font-semibold text-zinc-900 hover:text-blue-600"
          >
            {project.title}
          </a>

          <p className="mt-1 text-sm text-zinc-600">
            {r.budgetClient}: {formatBudget(project.budget, project.currency)} ·{" "}
            {c.client}: {project.client.name ?? project.client.email}
          </p>

          {underpriced > 0 && (
            <div className="mt-3 max-w-md">
              <p className="text-xs font-medium text-amber-900">
                {r.underpriced}: {underpriced} / {threshold}
                {underpricedInQueue > 0 &&
                  ` (${r.inQueue}: ${underpricedInQueue})`}
              </p>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className={`h-full rounded-full ${
                    project.moderationHot ? "bg-red-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${barPercent}%` }}
                />
              </div>
            </div>
          )}

          {otherCount > 0 && underpriced === 0 && (
            <p className="mt-2 text-xs text-orange-800">
              {r.otherReports}: {otherCount}
            </p>
          )}
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {group.reports.map((report) => (
          <ReportRow key={report.id} report={report} locale={locale} />
        ))}
      </ul>

      <ProjectGroupActions group={group} locale={locale} />
    </li>
  );
}

function UserReportGroupCard({
  group,
  locale,
}: {
  group: AdminReportUserGroup;
  locale: AppLocale;
}) {
  const r = getAdminCopy(locale).panels.reports;

  return (
    <li className="rounded-xl border border-orange-200 bg-orange-50/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-900">
          {r.userGroup} · {group.reports.length} {r.reportsWord}
        </span>
      </div>

      <a
        href={`/freelancers/${group.user.id}`}
        className="mt-2 block text-base font-semibold text-zinc-900 hover:text-blue-600"
      >
        {group.user.name ?? group.user.email}
      </a>
      <p className="mt-1 text-xs text-zinc-500">{group.user.role}</p>

      <ul className="mt-4 space-y-2">
        {group.reports.map((report) => (
          <ReportRow key={report.id} report={report} locale={locale} />
        ))}
      </ul>

      <UserGroupActions group={group} locale={locale} />
    </li>
  );
}

type AdminReportsPanelProps = {
  reports: AdminReportItem[];
  locale: AppLocale;
};

export function AdminReportsPanel({ reports, locale }: AdminReportsPanelProps) {
  const r = getAdminCopy(locale).panels.reports;
  const groups = groupAdminReports(reports);

  if (groups.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">{r.titleEmpty}</h2>
        <p className="mt-3 text-sm text-zinc-600">{r.bodyEmpty}</p>
      </section>
    );
  }

  const totalReports = reports.length;
  const objectsLabel = adminReportObjectsLabel(groups.length, r, locale);

  return (
    <section className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-orange-900">
            {r.title} ({totalReports} · {groups.length} {objectsLabel})
          </h2>
          <p className="mt-1 text-sm text-zinc-600">{r.subtitle}</p>
        </div>
        <a
          href="/api/admin/export/reports"
          className="inline-flex rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          {r.exportCsv}
        </a>
      </div>

      <ul className="mt-4 space-y-4">
        {groups.map((group) =>
          group.kind === "project" ? (
            <ProjectReportGroupCard
              key={group.project.id}
              group={group}
              locale={locale}
            />
          ) : (
            <UserReportGroupCard key={group.user.id} group={group} locale={locale} />
          ),
        )}
      </ul>
    </section>
  );
}
