import { AdminDesktopSidebar } from "@/components/admin/AdminDesktopSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import type { AdminTabDefinition } from "@/lib/admin-tabs";
import type { AppLocale } from "@/lib/i18n/types";

type AdminDesktopShellProps = {
  children: React.ReactNode;
  permissions: AdminPermission[];
  badges: AdminMobileBadges;
  activeTab: AdminTabDefinition;
  locale: AppLocale;
};

export function AdminDesktopShell({
  children,
  permissions,
  badges,
  activeTab,
  locale,
}: AdminDesktopShellProps) {
  const copy = getAdminCopy(locale);

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-100">
      <AdminHeader />

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:py-8">
        <AdminDesktopSidebar
          permissions={permissions}
          badges={badges}
          locale={locale}
        />

        <div className="min-w-0 flex-1">
          <header className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
              {copy.panelTitle}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">
              {activeTab.label}
            </h1>
            <p className="mt-1 text-sm text-zinc-600">{activeTab.description}</p>
          </header>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
