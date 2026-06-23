"use client";

import { ADMIN_AUDIT_ACTION_LABELS, type AdminAuditEntry } from "@/lib/admin-audit";

type AdminAuditPanelProps = {
  entries: AdminAuditEntry[];
  mobile?: boolean;
};

export function AdminAuditPanel({ entries, mobile = false }: AdminAuditPanelProps) {
  return (
    <section
      className={
        mobile
          ? "space-y-3"
          : "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      }
    >
      {!mobile && (
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Журнал действий ({entries.length})
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Последние действия администраторов на платформе
          </p>
        </div>
      )}

      {entries.length === 0 ? (
        <p className={`text-sm text-zinc-600 ${mobile ? "" : "mt-4"}`}>
          Записей пока нет
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
                  {ADMIN_AUDIT_ACTION_LABELS[entry.action] ?? entry.action}
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(entry.createdAt).toLocaleString("ru-RU")}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-600">
                {entry.admin.name ?? entry.admin.email}
                {entry.targetId ? ` · ${entry.targetType ?? "target"}: ${entry.targetId.slice(0, 8)}…` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
