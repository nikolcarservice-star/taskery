"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { contractStatusColors } from "@/lib/contract-labels";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { formatBudget } from "@/lib/project-labels";
import type { ActiveTaskPreview } from "@/lib/tasks-shared";
import Link from "next/link";

type ActiveTasksPopoverProps = {
  tasks: ActiveTaskPreview[];
};

export function ActiveTasksPopover({ tasks }: ActiveTasksPopoverProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const p = dict.popovers.tasks;
  const statusLabels = dict.labels.contractStatus;

  return (
    <div
      role="dialog"
      aria-label={p.title}
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg"
    >
      <div className="border-b border-zinc-100 px-4 py-3">
        <h3 className="text-sm font-bold text-zinc-900">{p.heading}</h3>
      </div>

      <ul className="max-h-[320px] overflow-y-auto">
        {tasks.map((task) => (
          <li key={task.id} className="border-b border-zinc-50 last:border-0">
            <Link
              href={l(`/projects/${task.projectSlug}`)}
              className="block px-4 py-3 transition-colors hover:bg-indigo-50/50"
            >
              <p className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900">
                {task.projectTitle}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {task.clientName ?? p.client}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold tabular-nums text-emerald-700">
                  {formatBudget(
                    { toString: () => task.amount },
                    task.currency,
                  )}
                </span>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${contractStatusColors[task.status]}`}
                >
                  {statusLabels[task.status]}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="border-t border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <Link
          href={l("/dashboard/work")}
          className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          {p.viewAll}
        </Link>
      </div>
    </div>
  );
}
