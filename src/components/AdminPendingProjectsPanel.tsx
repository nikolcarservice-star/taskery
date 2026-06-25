"use client";

import { AdminActionError } from "@/components/AdminActionError";
import {
  adminApproveProject,
  adminRejectProject,
  type ProjectModerationState,
} from "@/lib/actions/admin-project-moderation";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { PendingProjectItem } from "@/lib/queries/admin-pending-projects";
import type { AppLocale } from "@/lib/i18n/types";
import Link from "next/link";
import { useActionState } from "react";

const initialState: ProjectModerationState = {};

function PendingProjectRow({
  project,
  locale,
}: {
  project: PendingProjectItem;
  locale: AppLocale;
}) {
  const c = getAdminCopy(locale).panels.common;
  const p = getAdminCopy(locale).panels.pendingProjects;
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
        <div className="min-w-0">
          <Link
            href={`/projects/${project.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-900 hover:text-blue-600 hover:underline"
          >
            {project.title}
          </Link>
          <p className="mt-1">
            <Link
              href={`/projects/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {p.viewProject}
            </Link>
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            {project.client.name ?? project.client.email}
            {project.category ? ` · ${project.category.name}` : ""}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {new Date(project.createdAt).toLocaleString(locale)}
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
              {c.approve}
            </button>
          </form>
          <form action={rejectAction} className="flex flex-col gap-2 sm:items-end">
            <input type="hidden" name="projectId" value={project.id} />
            <input
              name="reason"
              type="text"
              required
              placeholder={c.rejectReason}
              className="w-full min-w-[220px] rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:w-64"
            />
            <button
              type="submit"
              disabled={rejectPending}
              className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {c.reject}
            </button>
          </form>
        </div>
      </div>
      <AdminActionError
        error={approveState.error ?? rejectState.error}
        locale={locale}
        className="mt-2 text-sm text-red-600"
      />
      {(approveState.success || rejectState.success) && (
        <p className="mt-2 text-sm text-emerald-700">{c.done}</p>
      )}
    </li>
  );
}

export function AdminPendingProjectsPanel({
  projects,
  locale,
  compact = false,
}: {
  projects: PendingProjectItem[];
  locale: AppLocale;
  compact?: boolean;
}) {
  const p = getAdminCopy(locale).panels.pendingProjects;

  return (
    <section
      className={
        compact
          ? "rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          : "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      }
    >
      <h2 className="text-lg font-semibold text-zinc-900">
        {p.title} ({projects.length})
      </h2>
      {projects.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-600">{p.empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {projects.map((project) => (
            <PendingProjectRow key={project.id} project={project} locale={locale} />
          ))}
        </ul>
      )}
    </section>
  );
}
