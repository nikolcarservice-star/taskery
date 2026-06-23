"use client";

import {
  adminBanUser,
  adminBlockProject,
  adminDeleteUser,
  adminDismissReport,
  type ModerationActionState,
} from "@/lib/actions/admin-moderation";
import type { AdminReportItem } from "@/lib/reports-shared";
import { formatBudget } from "@/lib/project-labels";
import { UNDERPRICED_REPORT_THRESHOLD } from "@/lib/reports-shared";
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

function ModerationActions({
  report,
}: {
  report: AdminReportItem;
}) {
  const [dismissState, dismissAction, dismissPending] = useActionState(
    adminDismissReport,
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

  const targetUserId =
    report.targetUser?.id ?? report.targetProject?.client.id ?? null;
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
    <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4">
      <div className="flex flex-col gap-2">
        <form action={dismissAction} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="reportId" value={report.id} />
          <input
            name="adminNote"
            placeholder="Заметка"
            className="min-w-[140px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
          />
          <button
            type="submit"
            disabled={dismissPending}
            className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            Отклонить
          </button>
        </form>

        {report.targetProject && (
          <form action={blockAction} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="reportId" value={report.id} />
            <input type="hidden" name="projectId" value={report.targetProject.id} />
            <input
              name="adminNote"
              placeholder="Причина блокировки проекта"
              className="min-w-[140px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
            />
            <button
              type="submit"
              disabled={blockPending}
              className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50"
            >
              Заблокировать проект
            </button>
          </form>
        )}

        {targetUserId && (
          <>
            <form action={banAction} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="reportId" value={report.id} />
              <input type="hidden" name="userId" value={targetUserId} />
              <input
                name="adminNote"
                placeholder="Причина блокировки пользователя"
                className="min-w-[140px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
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
              <input type="hidden" name="reportId" value={report.id} />
              <input type="hidden" name="userId" value={targetUserId} />
              <input
                name="adminNote"
                placeholder="Причина удаления"
                className="min-w-[140px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
              />
              <button
                type="submit"
                disabled={deletePending}
                className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
              >
                Удалить пользователя
              </button>
            </form>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-700">Готово</p>}
    </div>
  );
}

type AdminReportsPanelProps = {
  reports: AdminReportItem[];
};

export function AdminReportsPanel({ reports }: AdminReportsPanelProps) {
  if (reports.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Жалобы (0)</h2>
        <p className="mt-3 text-sm text-zinc-600">Новых жалоб нет</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-orange-900">
        Жалобы ({reports.length})
      </h2>
      <ul className="mt-4 space-y-4">
        {reports.map((report) => {
          const threshold = UNDERPRICED_REPORT_THRESHOLD;
          const underpriced = report.targetProject?.underpricedReportCount ?? 0;
          const barPercent = Math.min(
            100,
            Math.round((Math.min(underpriced, threshold) / threshold) * 100),
          );

          return (
            <li
              key={report.id}
              className="rounded-xl border border-orange-100 bg-orange-50/40 p-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-orange-100 px-2 py-0.5 font-semibold text-orange-800">
                  {report.targetType === "PROJECT" ? "Проект" : "Пользователь"}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-zinc-600">
                  {REASON_LABELS[report.reason] ?? report.reason}
                </span>
                <span className="text-zinc-500">
                  {new Date(report.createdAt).toLocaleString("ru-RU")}
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-700">
                От: {report.reporter.name ?? report.reporter.email}
              </p>

              {report.targetProject && (
                <div className="mt-2 text-sm">
                  <a
                    href={`/projects/${report.targetProject.slug}`}
                    className="font-medium text-zinc-900 hover:text-blue-600"
                  >
                    {report.targetProject.title}
                  </a>
                  <p className="mt-1 text-zinc-600">
                    Бюджет:{" "}
                    {formatBudget(
                      report.targetProject.budget,
                      report.targetProject.currency,
                    )}{" "}
                    · Заказчик:{" "}
                    {report.targetProject.client.name ??
                      report.targetProject.client.email}
                  </p>
                  <div className="mt-2">
                    <div className="h-2 max-w-xs overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-orange-500"
                        style={{ width: `${barPercent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      Жалоб на заниженную цену: {underpriced} / {threshold}
                    </p>
                  </div>
                </div>
              )}

              {report.targetUser && (
                <p className="mt-2 text-sm text-zinc-700">
                  На пользователя:{" "}
                  <a
                    href={`/freelancers/${report.targetUser.id}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {report.targetUser.name ?? report.targetUser.email}
                  </a>
                </p>
              )}

              {report.details && (
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {report.details}
                </p>
              )}

              <ModerationActions report={report} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
