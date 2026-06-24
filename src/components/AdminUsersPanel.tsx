"use client";

import { AdminUserSanctions } from "@/components/AdminUserSanctions";
import {
  adminUsersBan,
  adminUsersDelete,
  adminUsersUnban,
  type UserActionState,
} from "@/lib/actions/admin-users";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AdminUserItem } from "@/lib/queries/admin-users";
import { formatUah } from "@/lib/freelancer-finances-shared";
import type { Role } from "@/generated/prisma/client";
import type { AppLocale } from "@/lib/i18n/types";
import { useActionState, useMemo, useState } from "react";

const initialState: UserActionState = {};

function UserActions({
  user,
  locale,
}: {
  user: AdminUserItem;
  locale: AppLocale;
}) {
  const u = getAdminCopy(locale).panels.users;
  const c = getAdminCopy(locale).panels.common;
  const [banState, banAction, banPending] = useActionState(
    adminUsersBan,
    initialState,
  );
  const [unbanState, unbanAction, unbanPending] = useActionState(
    adminUsersUnban,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    adminUsersDelete,
    initialState,
  );

  const error = banState.error || unbanState.error || deleteState.error;
  const success = banState.success || unbanState.success || deleteState.success;

  if (user.deletedAt) {
    return <span className="text-xs text-zinc-400">{u.accountDeleted}</span>;
  }

  return (
    <div className="flex flex-col gap-2 sm:items-end">
      {user.bannedAt ? (
        <form action={unbanAction} className="flex items-center gap-2">
          <input type="hidden" name="userId" value={user.id} />
          <button
            type="submit"
            disabled={unbanPending}
            className="rounded-full border border-emerald-300 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
          >
            {u.unban}
          </button>
        </form>
      ) : (
        <form action={banAction} className="flex flex-wrap items-center justify-end gap-2">
          <input type="hidden" name="userId" value={user.id} />
          <input
            name="reason"
            placeholder={c.reason}
            className="w-28 rounded-lg border border-zinc-300 px-2 py-1 text-xs sm:w-36"
          />
          <button
            type="submit"
            disabled={banPending}
            className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {u.ban}
          </button>
        </form>
      )}

      <form action={deleteAction} className="flex flex-wrap items-center justify-end gap-2">
        <input type="hidden" name="userId" value={user.id} />
        <input
          name="reason"
          placeholder={u.deleteReason}
          className="w-28 rounded-lg border border-zinc-300 px-2 py-1 text-xs sm:w-36"
        />
        <button
          type="submit"
          disabled={deletePending}
          className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {u.delete}
        </button>
      </form>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-700">{c.done}</p>}
      <AdminUserSanctions user={user} locale={locale} />
    </div>
  );
}

function UserStatusBadge({
  user,
  locale,
}: {
  user: AdminUserItem;
  locale: AppLocale;
}) {
  const u = getAdminCopy(locale).panels.users;

  if (user.deletedAt) {
    return (
      <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600">
        {u.badgeDeleted}
      </span>
    );
  }
  if (user.bannedAt) {
    const isTemp =
      user.bannedUntil && new Date(user.bannedUntil) > new Date();
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        {isTemp ? u.badgeTempBan : u.badgeBanned}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
      {u.badgeActive}
    </span>
  );
}

type AdminUsersPanelProps = {
  users: AdminUserItem[];
  locale: AppLocale;
  mobile?: boolean;
  initialQuery?: string;
  initialRole?: Role | "ALL";
  initialStatus?: "active" | "banned" | "deleted" | "all";
};

export function AdminUsersPanel({
  users,
  locale,
  mobile = false,
  initialQuery = "",
  initialRole = "ALL",
  initialStatus = "all",
}: AdminUsersPanelProps) {
  const u = getAdminCopy(locale).panels.users;
  const [query, setQuery] = useState(initialQuery);
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">(initialRole);
  const [statusFilter, setStatusFilter] = useState<
    "active" | "banned" | "deleted" | "all"
  >(initialStatus);

  const filtered = useMemo(() => {
    if (mobile) return users;

    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter !== "ALL" && user.role !== roleFilter) return false;
      if (statusFilter === "active" && (user.bannedAt || user.deletedAt)) {
        return false;
      }
      if (statusFilter === "banned" && !user.bannedAt) return false;
      if (statusFilter === "deleted" && !user.deletedAt) return false;
      if (!q) return true;
      return (
        user.email.toLowerCase().includes(q) ||
        (user.name?.toLowerCase().includes(q) ?? false) ||
        user.id.toLowerCase().includes(q)
      );
    });
  }, [users, query, roleFilter, statusFilter, mobile]);

  const searchFields = (
    <>
      <input
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={u.searchPlaceholder}
        className={`rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm ${mobile ? "w-full" : ""}`}
      />
      <select
        name="role"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value as Role | "ALL")}
        className={`rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm ${mobile ? "w-full" : ""}`}
      >
        <option value="ALL">{u.roleAll}</option>
        <option value="CLIENT">{u.roleClients}</option>
        <option value="FREELANCER">{u.roleFreelancers}</option>
      </select>
      <select
        name="status"
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(
            e.target.value as "active" | "banned" | "deleted" | "all",
          )
        }
        className={`rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm ${mobile ? "w-full" : ""}`}
      >
        <option value="all">{u.statusAll}</option>
        <option value="active">{u.statusActive}</option>
        <option value="banned">{u.statusBanned}</option>
        <option value="deleted">{u.statusDeleted}</option>
      </select>
    </>
  );

  return (
    <section
      className={
        mobile
          ? "space-y-4"
          : "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {!mobile && (
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {u.title} ({filtered.length})
            </h2>
            <p className="mt-1 text-sm text-zinc-600">{u.description}</p>
            <a
              href="/api/admin/export/users"
              className="mt-3 inline-flex rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              {u.exportCsv}
            </a>
          </div>
        )}
        <div className={`flex flex-col gap-2 ${mobile ? "w-full" : "flex-wrap sm:flex-row"}`}>
          {mobile ? (
            <form method="get" className="flex flex-col gap-2">
              {searchFields}
              <button
                type="submit"
                className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white"
              >
                {u.search}
              </button>
            </form>
          ) : (
            searchFields
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className={`text-sm text-zinc-600 ${mobile ? "" : "mt-6"}`}>
          {u.notFound}
        </p>
      ) : mobile ? (
        <ul className="space-y-3">
          {filtered.map((user) => (
            <li
              key={user.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-900">
                    {user.name ?? u.noName}
                  </p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </div>
                <UserStatusBadge user={user} locale={locale} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
                  {u.roles[user.role] ?? user.role}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">
                  {formatUah(Number(user.balance))}
                </span>
                {user.subscriptionPlan === "PRO" && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 font-medium text-indigo-700">
                    PRO
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {u.projects}: {user._count.projectsAsClient} · {u.contracts}:{" "}
                {user._count.contractsAsFreelancer} · {u.rating}:{" "}
                {user.rating > 0 ? user.rating.toFixed(1) : "—"}
              </p>
              {user.banReason && (
                <p className="mt-2 text-xs text-red-600">{user.banReason}</p>
              )}
              <div className="mt-3 border-t border-zinc-100 pt-3">
                <UserActions user={user} locale={locale} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-xs text-zinc-500">
                <th className="pb-3 pr-4 font-medium">{u.colUser}</th>
                <th className="pb-3 pr-4 font-medium">{u.colRole}</th>
                <th className="pb-3 pr-4 font-medium">{u.colBalance}</th>
                <th className="pb-3 pr-4 font-medium">{u.colActivity}</th>
                <th className="pb-3 pr-4 font-medium">{u.colStatus}</th>
                <th className="pb-3 font-medium text-right">{u.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-zinc-900">
                      {user.name ?? u.noName}
                    </p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {u.memberSince}{" "}
                      {new Date(user.createdAt).toLocaleDateString(locale)}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                      {u.roles[user.role] ?? user.role}
                    </span>
                    {user.subscriptionPlan === "PRO" && (
                      <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        PRO
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 font-medium text-zinc-900">
                    {formatUah(Number(user.balance))}
                  </td>
                  <td className="py-3 pr-4 text-xs text-zinc-600">
                    <p>
                      {u.projects}: {user._count.projectsAsClient}
                    </p>
                    <p>
                      {u.contracts}: {user._count.contractsAsFreelancer}
                    </p>
                    <p>
                      {u.rating}: {user.rating > 0 ? user.rating.toFixed(1) : "—"}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    <UserStatusBadge user={user} locale={locale} />
                    {user.banReason && (
                      <p className="mt-1 max-w-[160px] text-xs text-red-600">
                        {user.banReason}
                      </p>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <UserActions user={user} locale={locale} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
