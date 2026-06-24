"use client";

import { AdminSectionNav } from "@/components/admin/AdminSectionNav";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import type { AppLocale } from "@/lib/i18n/types";

type AdminDesktopSidebarProps = {
  permissions: AdminPermission[];
  badges: AdminMobileBadges;
  locale: AppLocale;
};

export function AdminDesktopSidebar(props: AdminDesktopSidebarProps) {
  return <AdminSectionNav {...props} platform="desktop" />;
}
