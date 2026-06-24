import { AdminSectionNav } from "@/components/admin/AdminSectionNav";
import { AdminMobileHeader } from "@/components/admin/mobile/AdminMobileChrome";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import type { AdminTabDefinition } from "@/lib/admin-tabs";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AppLocale } from "@/lib/i18n/types";

type AdminMobileShellProps = {
  children: React.ReactNode;
  permissions: AdminPermission[];
  badges: AdminMobileBadges;
  adminName: string | null;
  activeTab: AdminTabDefinition;
  locale: AppLocale;
};

export function AdminMobileShell({
  children,
  permissions,
  badges,
  adminName,
  activeTab,
  locale,
}: AdminMobileShellProps) {
  const copy = getAdminCopy(locale);

  return (
    <div className="admin-mobile-app-shell flex min-h-dvh flex-col bg-zinc-100">
      <AdminMobileHeader adminName={adminName} activeTab={activeTab} />

      <div className="flex min-h-0 flex-1 gap-3 px-3 py-3 sm:gap-4 sm:px-4">
        <AdminSectionNav
          permissions={permissions}
          badges={badges}
          locale={locale}
          platform="mobile"
        />

        <main className="admin-mobile-content min-w-0 flex-1 overflow-y-auto">
          <header className="mb-3 sm:mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
              {copy.panelTitle}
            </p>
            <h1 className="mt-0.5 text-lg font-bold text-zinc-900 sm:text-xl">
              {activeTab.label}
            </h1>
            <p className="mt-0.5 text-xs text-zinc-600 sm:text-sm">
              {activeTab.description}
            </p>
          </header>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-sm sm:p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
