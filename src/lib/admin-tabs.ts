import { hasAdminPermission } from "@/lib/admin-permissions";
import type { AdminPermission } from "@/generated/prisma/client";

export type AdminTabKey =
  | "overview"
  | "moderation"
  | "users"
  | "finance"
  | "platform"
  | "team";

export type ModerationSectionKey =
  | "attention"
  | "disputes"
  | "reports"
  | "projects"
  | "support";

export type AdminTabDefinition = {
  id: AdminTabKey;
  label: string;
  description: string;
  permission?: AdminPermission;
};

export const ADMIN_TABS: AdminTabDefinition[] = [
  {
    id: "overview",
    label: "Обзор",
    description: "Сводка и аналитика",
  },
  {
    id: "moderation",
    label: "Модерация",
    description: "Жалобы, споры, контакты",
    permission: "MODERATION",
  },
  {
    id: "users",
    label: "Пользователи",
    description: "Верификация и аккаунты",
    permission: "USERS",
  },
  {
    id: "finance",
    label: "Финансы",
    description: "Эскроу, выводы, платежи",
    permission: "FINANCE",
  },
  {
    id: "platform",
    label: "Платформа",
    description: "Каталог, CMS, рассылки",
    permission: "STAFF_MANAGE",
  },
  {
    id: "team",
    label: "Команда",
    description: "Админы и журнал",
    permission: "STAFF_MANAGE",
  },
];

export const MODERATION_SECTIONS: {
  id: ModerationSectionKey;
  label: string;
}[] = [
  { id: "attention", label: "Внимание" },
  { id: "disputes", label: "Споры" },
  { id: "reports", label: "Жалобы" },
  { id: "projects", label: "Проекты" },
  { id: "support", label: "Поддержка" },
];

export function getVisibleAdminTabs(
  permissions: AdminPermission[],
): AdminTabDefinition[] {
  return ADMIN_TABS.filter(
    (tab) => !tab.permission || hasAdminPermission(permissions, tab.permission),
  );
}

export function isAdminTabKey(value: string | null): value is AdminTabKey {
  return ADMIN_TABS.some((tab) => tab.id === value);
}

export function resolveAdminTab(
  value: string | null,
  permissions: AdminPermission[],
): AdminTabKey {
  const visible = getVisibleAdminTabs(permissions);
  if (value && isAdminTabKey(value) && visible.some((tab) => tab.id === value)) {
    return value;
  }
  return visible[0]?.id ?? "overview";
}
