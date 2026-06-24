"use client";

import { getAdminCopy } from "@/lib/admin-i18n";
import type { AdminAuditEntry } from "@/lib/admin-audit-types";
import type { AppLocale } from "@/lib/i18n/types";

type AdminAuditPanelProps = {
  entries: AdminAuditEntry[];
  locale: AppLocale;
  mobile?: boolean;
};

export function AdminAuditPanel({
  entries,
  locale,
  mobile = false,
}: AdminAuditPanelProps) {
  const a = getAdminCopy(locale).panels.audit;

  return (
    <section
      className={
        mobile
          ? "space-y-3"
          : "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      }
    >
      {!mobile && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {a.title} ({entries.length})
            </h2>
            <p className="mt-1 text-sm text-zinc-600">{a.description}</p>
          </div>
          <a
            href="/api/admin/export/audit"
            className="inline-flex rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
          >
            {a.exportCsv}
          </a>
        </div>
      )}

      {entries.length === 0 ? (
        <p className={`text-sm text-zinc-600 ${mobile ? "" : "mt-4"}`}>
          {a.empty}
        </p>
      ) : (
        <ul className={`space-y-2 ${mobile ? "" : "mt-4 max-h-96 overflow-y-auto"}`}>
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl border border-zinc-100 bg-zinc-50/70 px-3 py-2.5 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-zinc-900">
                  {a.actions[entry.action] ?? entry.action}
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(entry.createdAt).toLocaleString(locale)}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-600">
                {entry.admin.name ?? entry.admin.email}
                {entry.targetId
                  ? ` · ${entry.targetType ?? a.target}: ${entry.targetId.slice(0, 8)}…`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
