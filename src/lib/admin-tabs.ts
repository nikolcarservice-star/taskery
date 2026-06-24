import { hasAdminPermission } from "@/lib/admin-permissions";
import type { AdminPermission } from "@/generated/prisma/client";

export const ADMIN_DESKTOP_ROOT = "/admin/overview";

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
  href: string;
  icon: string;
  permission?: AdminPermission;
};

export const ADMIN_TABS: AdminTabDefinition[] = [
  {
    id: "overview",
    label: "Обзор",
    description: "Сводка платформы и быстрые действия",
    href: "/admin/overview",
    icon: "📊",
  },
  {
    id: "moderation",
    label: "Модерация",
    description: "Жалобы, споры, контакты и поддержка",
    href: "/admin/moderation",
    icon: "🛡️",
    permission: "MODERATION",
  },
  {
    id: "users",
    label: "Пользователи",
    description: "Верификация и управление аккаунтами",
    href: "/admin/users",
    icon: "👥",
    permission: "USERS",
  },
  {
    id: "finance",
    label: "Финансы",
    description: "Эскроу, выводы и платежи",
    href: "/admin/finance",
    icon: "💰",
    permission: "FINANCE",
  },
  {
    id: "platform",
    label: "Платформа",
    description: "Каталог, CMS и рассылки",
    href: "/admin/platform",
    icon: "⚙️",
    permission: "STAFF_MANAGE",
  },
  {
    id: "team",
    label: "Команда",
    description: "Администраторы и журнал действий",
    href: "/admin/team",
    icon: "👤",
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

export function resolveAdminTabFromPath(
  pathname: string,
  permissions: AdminPermission[],
): AdminTabDefinition {
  const visible = getVisibleAdminTabs(permissions);
  const match = visible.find(
    (tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`),
  );
  return match ?? visible[0] ?? ADMIN_TABS[0];
}

export function isAdminDesktopAppPath(pathname: string): boolean {
  return (
    pathname === "/admin/overview" ||
    ADMIN_TABS.some(
      (tab) =>
        tab.href !== "/admin/overview" &&
        (pathname === tab.href || pathname.startsWith(`${tab.href}/`)),
    )
  );
}

export function resolveModerationSection(
  value: string | null,
): ModerationSectionKey {
  if (value && MODERATION_SECTIONS.some((section) => section.id === value)) {
    return value as ModerationSectionKey;
  }
  return "attention";
}
