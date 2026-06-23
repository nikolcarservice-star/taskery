"use client";

import {
  adminBanUser,
  adminBlockProject,
  adminDeleteUser,
  adminDismissProjectReports,
  adminDismissUserReports,
  adminTakeReportReview,
  type ModerationActionState,
} from "@/lib/actions/admin-moderation";
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
import { useActionState } from "react";

const initialState: ModerationActionState = {};

const REASON_LABELS: Record<string, string> = {
  UNDERPRICED: "Заниженная цена",
  SPAM: "Спам",
  FRAUD: "Мошенничество",
  HARASSMENT: "Оскорбления",
  IRRELEVANT: "Нерелевантно",
  POLICY_VIOLATION: "Нарушение правил",
  FAKE_PROFILE: "Фейковый профиль",
  OTHER: "Другое",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Новая",
  IN_REVIEW: "В работе",
};

function ReportRow({ report }: { report: AdminReportItem }) {
  const [reviewState, reviewAction, reviewPending] = useActionState(
    adminTakeReportReview,
    initialState,
  );

  return (
    <li className="rounded-lg border border-orange-100/80 bg-white px-3 py-2.5 text-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-orange-50 px-2 py-0.5 font-medium text-orange-800">
          {REASON_LABELS[report.reason] ?? report.reason}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 font-medium ${
            report.status === "IN_REVIEW"
              ? "bg-blue-100 text-blue-800"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {STATUS_LABELS[report.status] ?? report.status}
        </span>
        <span className="text-zinc-500">
          {new Date(report.createdAt).toLocaleString("ru-RU")}
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
            Взять в работу
          </button>
          {reviewState.error && (
            <p className="mt-1 text-xs text-red-600">{reviewState.error}</p>
          )}
        </form>
      )}
    </li>
  );
}

function ProjectGroupActions({ group }: { group: AdminReportProjectGroup }) {
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
          placeholder="Заметка при отклонении всех жалоб"
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={dismissPending}
          className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          Отклонить все ({group.reports.length})
        </button>
      </form>

      <form action={blockAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="projectId" value={group.project.id} />
        <input
          name="adminNote"
          placeholder="Причина блокировки проекта"
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={blockPending}
          className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50"
        >
          Заблокировать проект
        </button>
      </form>

      <form action={banAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="userId" value={clientId} />
        <input
          name="adminNote"
          placeholder="Причина блокировки заказчика"
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={banPending}
          className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          Заблокировать заказчика
        </button>
      </form>

      <form action={deleteAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="userId" value={clientId} />
        <input
          name="adminNote"
          placeholder="Причина удаления заказчика"
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={deletePending}
          className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          Удалить заказчика
        </button>
      </form>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-700">Готово</p>}
    </div>
  );
}

function UserGroupActions({ group }: { group: AdminReportUserGroup }) {
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
          placeholder="Заметка при отклонении всех жалоб"
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={dismissPending}
          className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          Отклонить все ({group.reports.length})
        </button>
      </form>

      <form action={banAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="userId" value={group.user.id} />
        <input
          name="adminNote"
          placeholder="Причина блокировки"
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={banPending}
          className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          Заблокировать пользователя
        </button>
      </form>

      <form action={deleteAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="userId" value={group.user.id} />
        <input
          name="adminNote"
          placeholder="Причина удаления"
          className="min-w-[160px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={deletePending}
          className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          Удалить пользователя
        </button>
      </form>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-700">Готово</p>}
    </div>
  );
}

function ProjectReportGroupCard({ group }: { group: AdminReportProjectGroup }) {
  const threshold = UNDERPRICED_REPORT_THRESHOLD;
  const project = group.project;
  const underpriced = project.underpricedReportCount;
  const otherCount = getOtherReportCount(project.reportCount, underpriced);
  const underpricedInQueue = group.reports.filter(
    (r) => r.reason === "UNDERPRICED",
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
              Проект · {group.reports.length} жалоб
            </span>
            {project.moderationHot && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                На проверке
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
            Бюджет: {formatBudget(project.budget, project.currency)} · Заказчик:{" "}
            {project.client.name ?? project.client.email}
          </p>

          {underpriced > 0 && (
            <div className="mt-3 max-w-md">
              <p className="text-xs font-medium text-amber-900">
                Заниженная цена: {underpriced} / {threshold}
                {underpricedInQueue > 0 &&
                  ` (в очереди: ${underpricedInQueue})`}
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
              Других жалоб на проект: {otherCount}
            </p>
          )}
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {group.reports.map((report) => (
          <ReportRow key={report.id} report={report} />
        ))}
      </ul>

      <ProjectGroupActions group={group} />
    </li>
  );
}

function UserReportGroupCard({ group }: { group: AdminReportUserGroup }) {
  return (
    <li className="rounded-xl border border-orange-200 bg-orange-50/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-900">
          Пользователь · {group.reports.length} жалоб
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
          <ReportRow key={report.id} report={report} />
        ))}
      </ul>

      <UserGroupActions group={group} />
    </li>
  );
}

type AdminReportsPanelProps = {
  reports: AdminReportItem[];
};

export function AdminReportsPanel({ reports }: AdminReportsPanelProps) {
  const groups = groupAdminReports(reports);

  if (groups.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Жалобы (0)</h2>
        <p className="mt-3 text-sm text-zinc-600">Новых жалоб нет</p>
      </section>
    );
  }

  const totalReports = reports.length;

  return (
    <section className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-orange-900">
        Жалобы ({totalReports} · {groups.length}{" "}
        {groups.length === 1 ? "объект" : groups.length < 5 ? "объекта" : "объектов"})
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        Жалобы сгруппированы по проекту или пользователю
      </p>

      <ul className="mt-4 space-y-4">
        {groups.map((group) =>
          group.kind === "project" ? (
            <ProjectReportGroupCard key={group.project.id} group={group} />
          ) : (
            <UserReportGroupCard key={group.user.id} group={group} />
          ),
        )}
      </ul>
    </section>
  );
}
