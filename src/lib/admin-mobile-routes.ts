import type { AdminPermission } from "@/generated/prisma/client";
import { hasAdminPermission } from "@/lib/admin-permissions";

export const ADMIN_MOBILE_ROOT = "/admin/mobile";

export type AdminMobileTabKey =
  | "home"
  | "moderation"
  | "users"
  | "finance"
  | "more";

export type AdminMobileTab = {
  key: AdminMobileTabKey;
  label: string;
  href: string;
  icon: string;
  permission?: AdminPermission;
};

export const ADMIN_MOBILE_TABS: AdminMobileTab[] = [
  { key: "home", label: "Главная", href: ADMIN_MOBILE_ROOT, icon: "🏠" },
  {
    key: "moderation",
    label: "Модерация",
    href: `${ADMIN_MOBILE_ROOT}/moderation`,
    icon: "🛡️",
    permission: "MODERATION",
  },
  {
    key: "users",
    label: "Люди",
    href: `${ADMIN_MOBILE_ROOT}/users`,
    icon: "👥",
    permission: "USERS",
  },
  {
    key: "finance",
    label: "Финансы",
    href: `${ADMIN_MOBILE_ROOT}/finance`,
    icon: "💰",
    permission: "FINANCE",
  },
  { key: "more", label: "Ещё", href: `${ADMIN_MOBILE_ROOT}/more`, icon: "⋯" },
];

export function isAdminMobileAppPath(path: string): boolean {
  return path === ADMIN_MOBILE_ROOT || path.startsWith(`${ADMIN_MOBILE_ROOT}/`);
}

export function getVisibleAdminMobileTabs(
  permissions: AdminPermission[],
): AdminMobileTab[] {
  return ADMIN_MOBILE_TABS.filter(
    (tab) => !tab.permission || hasAdminPermission(permissions, tab.permission),
  );
}

export function getAdminMobilePageTitle(path: string): string {
  if (path === ADMIN_MOBILE_ROOT) return "Админ-панель";
  if (path.startsWith(`${ADMIN_MOBILE_ROOT}/moderation`)) return "Модерация";
  if (path.startsWith(`${ADMIN_MOBILE_ROOT}/users`)) return "Пользователи";
  if (path.startsWith(`${ADMIN_MOBILE_ROOT}/finance`)) return "Финансы";
  if (path.startsWith(`${ADMIN_MOBILE_ROOT}/support`)) return "Поддержка";
  if (path.startsWith(`${ADMIN_MOBILE_ROOT}/verification`)) return "Верификация";
  if (path.startsWith(`${ADMIN_MOBILE_ROOT}/catalog`)) return "Каталог";
  if (path.startsWith(`${ADMIN_MOBILE_ROOT}/withdrawals`)) return "Выводы";
  if (path.startsWith(`${ADMIN_MOBILE_ROOT}/staff`)) return "Команда";
  if (path.startsWith(`${ADMIN_MOBILE_ROOT}/more`)) return "Ещё";
  return "Админ";
}
