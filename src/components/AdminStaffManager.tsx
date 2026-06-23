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
  ADMIN_PERMISSION_LABELS,
  isSuperAdmin,
} from "@/lib/admin-permissions";
import type { AdminPermission } from "@/generated/prisma/client";
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
};

const initialState: StaffActionState = {};

function PermissionCheckboxes({
  name,
  defaultValues = [],
}: {
  name: string;
  defaultValues?: AdminPermission[];
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {ADMIN_PERMISSION_OPTIONS.map((option) => (
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
            <span className="font-medium text-zinc-900">{option.label}</span>
            <span className="mt-0.5 block text-xs text-zinc-500">
              {option.description}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
}

function PermissionBadges({
  permissions,
}: {
  permissions: AdminPermission[];
}) {
  const labels = isSuperAdmin(permissions)
    ? ["Полный доступ"]
    : permissions.map((permission) => ADMIN_PERMISSION_LABELS[permission]);

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

function CreateAdminForm() {
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
        + Добавить администратора
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5"
    >
      <h3 className="text-base font-semibold text-zinc-900">
        Новый администратор
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">Имя</span>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900"
            placeholder="Мария Иванова"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">Email</span>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900"
            placeholder="moderator@taskery.local"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-zinc-700">Пароль</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900"
            placeholder="Минимум 8 символов"
          />
        </label>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-zinc-700">Функции</p>
        <div className="mt-2">
          <PermissionCheckboxes name="permissions" />
        </div>
      </div>

      {state.error && (
        <p className="mt-3 text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="mt-3 text-sm text-green-700">
          Администратор добавлен
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? "Сохранение…" : "Создать"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}

function EditAdminForm({
  admin,
  currentAdminId,
}: {
  admin: AdminStaffMember;
  currentAdminId: string;
}) {
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
        Изменить
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
          <span className="font-medium text-zinc-700">Имя</span>
          <input
            name="name"
            required
            defaultValue={admin.name ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">Email</span>
          <input
            value={admin.email}
            readOnly
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-zinc-500"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-zinc-700">Новый пароль</span>
          <input
            name="password"
            type="password"
            minLength={8}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
            placeholder="Оставьте пустым, чтобы не менять"
          />
        </label>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-zinc-700">Функции</p>
        <div className="mt-2">
          <PermissionCheckboxes
            name="permissions"
            defaultValues={admin.adminPermissions}
          />
        </div>
      </div>

      {(state.error) && (
        <p className="mt-3 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="mt-3 text-sm text-green-700">Изменения сохранены</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? "Сохранение…" : "Сохранить"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Закрыть
        </button>
      </div>
    </form>
  );
}

function DeactivateAdminButton({
  adminId,
  currentAdminId,
}: {
  adminId: string;
  currentAdminId: string;
}) {
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
        <p className="mb-2 text-sm text-green-700">Администратор деактивирован</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        Деактивировать
      </button>
    </form>
  );
}

function ReactivateAdminButton({ adminId }: { adminId: string }) {
  const [state, formAction, pending] = useActionState(
    reactivateAdminStaff,
    initialState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="adminId" value={adminId} />
      {state.error && <p className="mb-2 text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="mb-2 text-sm text-green-700">Администратор восстановлен</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
      >
        {pending ? "Восстановление…" : "Восстановить"}
      </button>
    </form>
  );
}

function DeleteAdminButton({
  adminId,
  currentAdminId,
}: {
  adminId: string;
  currentAdminId: string;
}) {
  const [state, formAction, pending] = useActionState(
    deleteAdminStaff,
    initialState,
  );

  if (adminId === currentAdminId) return null;

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (
          !confirm(
            "Удалить администратора навсегда? Это действие нельзя отменить.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="adminId" value={adminId} />
      {state.error && <p className="mb-2 text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="mb-2 text-sm text-green-700">Администратор удалён</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100 disabled:opacity-50"
      >
        {pending ? "Удаление…" : "Удалить навсегда"}
      </button>
    </form>
  );
}

export function AdminStaffManager({
  admins,
  currentAdminId,
}: AdminStaffManagerProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Команда администраторов ({admins.length})
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Добавляйте админов с разными функциями: модерация, пользователи,
            финансы и управление командой.
          </p>
        </div>
        <CreateAdminForm />
      </div>

      <ul className="mt-6 divide-y divide-zinc-100">
        {admins.map((admin) => (
          <li key={admin.id} className="py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-zinc-900">
                    {admin.name ?? "Без имени"}
                  </p>
                  {admin.id === currentAdminId && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                      Вы
                    </span>
                  )}
                  {!admin.adminActive && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      Деактивирован
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-zinc-500">{admin.email}</p>
                <div className="mt-2">
                  <PermissionBadges permissions={admin.adminPermissions} />
                </div>
              </div>
              {admin.adminActive ? (
                <div className="flex flex-col items-start gap-2">
                  <EditAdminForm admin={admin} currentAdminId={currentAdminId} />
                  <DeactivateAdminButton
                    adminId={admin.id}
                    currentAdminId={currentAdminId}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-start gap-2">
                  <ReactivateAdminButton adminId={admin.id} />
                  <DeleteAdminButton
                    adminId={admin.id}
                    currentAdminId={currentAdminId}
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
