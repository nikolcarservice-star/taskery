import type { AdminPermission } from "@/generated/prisma/client";

export const ADMIN_PERMISSION_OPTIONS: {
  value: AdminPermission;
  label: string;
  description: string;
}[] = [
  {
    value: "FULL_ACCESS",
    label: "Полный доступ",
    description: "Все функции админ-панели, включая управление командой",
  },
  {
    value: "STAFF_MANAGE",
    label: "Управление админами",
    description: "Добавление и редактирование администраторов",
  },
  {
    value: "MODERATION",
    label: "Модерация",
    description: "Споры, закрытие проектов, модерация контента",
  },
  {
    value: "USERS",
    label: "Пользователи",
    description: "Просмотр и управление аккаунтами клиентов и фрилансеров",
  },
  {
    value: "FINANCE",
    label: "Финансы",
    description: "Платежи, эскроу и финансовые операции",
  },
];

export const ADMIN_PERMISSION_LABELS: Record<AdminPermission, string> =
  Object.fromEntries(
    ADMIN_PERMISSION_OPTIONS.map((item) => [item.value, item.label]),
  ) as Record<AdminPermission, string>;

export function isSuperAdmin(permissions: AdminPermission[]): boolean {
  return (
    permissions.length === 0 ||
    permissions.includes("FULL_ACCESS")
  );
}

export function hasAdminPermission(
  permissions: AdminPermission[],
  required: AdminPermission,
): boolean {
  if (isSuperAdmin(permissions)) return true;
  return permissions.includes(required);
}

export function parseAdminPermissions(
  values: FormDataEntryValue[],
): AdminPermission[] {
  const allowed = new Set(ADMIN_PERMISSION_OPTIONS.map((item) => item.value));
  const selected = values
    .map((value) => String(value))
    .filter((value): value is AdminPermission =>
      allowed.has(value as AdminPermission),
    );

  if (selected.includes("FULL_ACCESS")) {
    return ["FULL_ACCESS"];
  }

  return [...new Set(selected)];
}
