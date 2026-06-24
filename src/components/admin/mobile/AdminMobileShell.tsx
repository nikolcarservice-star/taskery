import { AdminMobileBottomNav } from "@/components/admin/mobile/AdminMobileBottomNav";
import { AdminMobileHeader } from "@/components/admin/mobile/AdminMobileChrome";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import type { AdminTabDefinition } from "@/lib/admin-tabs";
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
  return (
    <div className="admin-mobile-app-shell flex min-h-dvh flex-col bg-zinc-100">
      <AdminMobileHeader adminName={adminName} activeTab={activeTab} />

      <main className="admin-mobile-content flex-1 overflow-y-auto overscroll-contain px-4 py-3">
        <p className="text-sm text-zinc-600">{activeTab.description}</p>
        <div className="mt-3">{children}</div>
      </main>

      <AdminMobileBottomNav
        permissions={permissions}
        badges={badges}
        locale={locale}
      />
    </div>
  );
}
