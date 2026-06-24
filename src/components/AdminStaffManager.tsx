"use client";

import {
  createAdminStaff,
  deactivateAdminStaff,
  deleteAdminStaff,
  reactivateAdminStaff,
  updateAdminStaff,
  type StaffActionState,
} from "@/lib/actions/admin-staff";
import {
  ADMIN_PERMISSION_OPTIONS,
  isSuperAdmin,
} from "@/lib/admin-permissions";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AppLocale } from "@/lib/i18n/types";
import { useActionState, useState } from "react";

export type AdminStaffMember = {
  id: string;
  name: string | null;
  email: string;
  adminPermissions: AdminPermission[];
  adminActive: boolean;
  createdAt: string;
};

type AdminStaffManagerProps = {
  admins: AdminStaffMember[];
  currentAdminId: string;
  locale: AppLocale;
};

const initialState: StaffActionState = {};

function PermissionCheckboxes({
  name,
  defaultValues = [],
  locale,
}: {
  name: string;
  defaultValues?: AdminPermission[];
  locale: AppLocale;
}) {
  const permissions = getAdminCopy(locale).panels.staff.permissions;

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {ADMIN_PERMISSION_OPTIONS.map((option) => {
        const copy = permissions[option.value];
        return (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 text-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={defaultValues.includes(option.value)}
              className="mt-0.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              <span className="font-medium text-zinc-900">
                {copy?.label ?? option.label}
              </span>
              <span className="mt-0.5 block text-xs text-zinc-500">
                {copy?.description ?? option.description}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

function PermissionBadges({
  permissions,
  locale,
}: {
  permissions: AdminPermission[];
  locale: AppLocale;
}) {
  const s = getAdminCopy(locale).panels.staff;
  const labels = isSuperAdmin(permissions)
    ? [s.fullAccess]
    : permissions.map(
        (permission) =>
          s.permissions[permission]?.label ?? permission,
      );

  return (
    <div className="flex flex-wrap gap-1.5">
      {labels.map((label) => (
        <span
          key={label}
          className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function CreateAdminForm({ locale }: { locale: AppLocale }) {
  const s = getAdminCopy(locale).panels.staff;
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createAdminStaff,
    initialState,
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        {s.addAdmin}
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5"
    >
      <h3 className="text-base font-semibold text-zinc-900">{s.newAdminTitle}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">{s.name}</span>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900"
            placeholder={s.namePlaceholder}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">{s.email}</span>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900"
            placeholder="moderator@taskery.local"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-zinc-700">{s.password}</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900"
            placeholder={s.passwordMinPlaceholder}
          />
        </label>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-zinc-700">{s.functions}</p>
        <div className="mt-2">
          <PermissionCheckboxes name="permissions" locale={locale} />
        </div>
      </div>

      {state.error && (
        <p className="mt-3 text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="mt-3 text-sm text-green-700">{s.adminAdded}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? s.saving : s.create}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {s.cancel}
        </button>
      </div>
    </form>
  );
}

function EditAdminForm({
  admin,
  currentAdminId,
  locale,
}: {
  admin: AdminStaffMember;
  currentAdminId: string;
  locale: AppLocale;
}) {
  const s = getAdminCopy(locale).panels.staff;
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateAdminStaff,
    initialState,
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        {s.edit}
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <input type="hidden" name="adminId" value={admin.id} />
      <input
        type="hidden"
        name="adminActive"
        value={admin.adminActive ? "true" : "false"}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">{s.name}</span>
          <input
            name="name"
            required
            defaultValue={admin.name ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">{s.email}</span>
          <input
            value={admin.email}
            readOnly
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-zinc-500"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-zinc-700">{s.newPassword}</span>
          <input
            name="password"
            type="password"
            minLength={8}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
            placeholder={s.passwordKeepEmpty}
          />
        </label>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-zinc-700">{s.functions}</p>
        <div className="mt-2">
          <PermissionCheckboxes
            name="permissions"
            defaultValues={admin.adminPermissions}
            locale={locale}
          />
        </div>
      </div>

      {(state.error) && (
        <p className="mt-3 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="mt-3 text-sm text-green-700">{s.changesSaved}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? s.saving : s.save}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {s.close}
        </button>
      </div>
    </form>
  );
}

function DeactivateAdminButton({
  adminId,
  currentAdminId,
  locale,
}: {
  adminId: string;
  currentAdminId: string;
  locale: AppLocale;
}) {
  const s = getAdminCopy(locale).panels.staff;
  const [state, formAction, pending] = useActionState(
    deactivateAdminStaff,
    initialState,
  );

  if (adminId === currentAdminId) return null;

  return (
    <form action={formAction} className="mt-2">
      <input type="hidden" name="adminId" value={adminId} />
      {state.error && <p className="mb-2 text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="mb-2 text-sm text-green-700">{s.deactivated}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        {s.deactivate}
      </button>
    </form>
  );
}

function ReactivateAdminButton({
  adminId,
  locale,
}: {
  adminId: string;
  locale: AppLocale;
}) {
  const s = getAdminCopy(locale).panels.staff;
  const [state, formAction, pending] = useActionState(
    reactivateAdminStaff,
    initialState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="adminId" value={adminId} />
      {state.error && <p className="mb-2 text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="mb-2 text-sm text-green-700">{s.restored}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
      >
        {pending ? s.reactivating : s.reactivate}
      </button>
    </form>
  );
}

function DeleteAdminButton({
  adminId,
  currentAdminId,
  locale,
}: {
  adminId: string;
  currentAdminId: string;
  locale: AppLocale;
}) {
  const s = getAdminCopy(locale).panels.staff;
  const [state, formAction, pending] = useActionState(
    deleteAdminStaff,
    initialState,
  );

  if (adminId === currentAdminId) return null;

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!confirm(s.deleteConfirm)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="adminId" value={adminId} />
      {state.error && <p className="mb-2 text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="mb-2 text-sm text-green-700">{s.deleted}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100 disabled:opacity-50"
      >
        {pending ? s.deleting : s.deleteForever}
      </button>
    </form>
  );
}

export function AdminStaffManager({
  admins,
  currentAdminId,
  locale,
}: AdminStaffManagerProps) {
  const s = getAdminCopy(locale).panels.staff;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            {s.title} ({admins.length})
          </h2>
          <p className="mt-1 text-sm text-zinc-600">{s.description}</p>
        </div>
        <CreateAdminForm locale={locale} />
      </div>

      <ul className="mt-6 divide-y divide-zinc-100">
        {admins.map((admin) => (
          <li key={admin.id} className="py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-zinc-900">
                    {admin.name ?? s.noName}
                  </p>
                  {admin.id === currentAdminId && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                      {s.you}
                    </span>
                  )}
                  {!admin.adminActive && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      {s.deactivatedBadge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-zinc-500">{admin.email}</p>
                <div className="mt-2">
                  <PermissionBadges
                    permissions={admin.adminPermissions}
                    locale={locale}
                  />
                </div>
              </div>
              {admin.adminActive ? (
                <div className="flex flex-col items-start gap-2">
                  <EditAdminForm
                    admin={admin}
                    currentAdminId={currentAdminId}
                    locale={locale}
                  />
                  <DeactivateAdminButton
                    adminId={admin.id}
                    currentAdminId={currentAdminId}
                    locale={locale}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-start gap-2">
                  <ReactivateAdminButton adminId={admin.id} locale={locale} />
                  <DeleteAdminButton
                    adminId={admin.id}
                    currentAdminId={currentAdminId}
                    locale={locale}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
