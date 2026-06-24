"use client";

import {
  adminApproveProject,
  adminRejectProject,
  type ProjectModerationState,
} from "@/lib/actions/admin-project-moderation";
import type { PendingProjectItem } from "@/lib/queries/admin-pending-projects";
import { useActionState } from "react";

const initialState: ProjectModerationState = {};

function PendingProjectRow({ project }: { project: PendingProjectItem }) {
  const [approveState, approveAction, approvePending] = useActionState(
    adminApproveProject,
    initialState,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(
    adminRejectProject,
    initialState,
  );

  return (
    <li className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-medium text-zinc-900">{project.title}</p>
          <p className="mt-1 text-sm text-zinc-600">
            {project.client.name ?? project.client.email}
            {project.category ? ` · ${project.category.name}` : ""}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {new Date(project.createdAt).toLocaleString("ru-RU")}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <form action={approveAction}>
            <input type="hidden" name="projectId" value={project.id} />
            <button
              type="submit"
              disabled={approvePending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Одобрить
            </button>
          </form>
          <form action={rejectAction} className="flex flex-col gap-2 sm:items-end">
            <input type="hidden" name="projectId" value={project.id} />
            <input
              name="reason"
              type="text"
              required
              placeholder="Причина отклонения"
              className="w-full min-w-[220px] rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:w-64"
            />
            <button
              type="submit"
              disabled={rejectPending}
              className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              Отклонить
            </button>
          </form>
        </div>
      </div>
      {(approveState.error || rejectState.error) && (
        <p className="mt-2 text-sm text-red-600">{approveState.error ?? rejectState.error}</p>
      )}
      {(approveState.success || rejectState.success) && (
        <p className="mt-2 text-sm text-emerald-700">Готово</p>
      )}
    </li>
  );
}

export function AdminPendingProjectsPanel({
  projects,
  compact = false,
}: {
  projects: PendingProjectItem[];
  compact?: boolean;
}) {
  return (
    <section
      className={
        compact
          ? "rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          : "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      }
    >
      <h2 className="text-lg font-semibold text-zinc-900">
        Премодерация проектов ({projects.length})
      </h2>
      {projects.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-600">Нет проектов в очереди</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {projects.map((project) => (
            <PendingProjectRow key={project.id} project={project} />
          ))}
        </ul>
      )}
    </section>
  );
}
