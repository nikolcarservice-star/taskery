import {
  AdminMobileBottomNav,
  AdminMobileHeader,
} from "@/components/admin/mobile/AdminMobileChrome";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AdminMobileBadges } from "@/lib/queries/admin-mobile-badges";

type AdminMobileShellProps = {
  children: React.ReactNode;
  permissions: AdminPermission[];
  badges: AdminMobileBadges;
  adminName: string | null;
};

export function AdminMobileShell({
  children,
  permissions,
  badges,
  adminName,
}: AdminMobileShellProps) {
  return (
    <div className="admin-mobile-app-shell flex min-h-dvh flex-col bg-zinc-100">
      <AdminMobileHeader adminName={adminName} />
      <main className="admin-mobile-content flex-1 px-4 py-4">{children}</main>
      <AdminMobileBottomNav permissions={permissions} badges={badges} />
    </div>
  );
}
