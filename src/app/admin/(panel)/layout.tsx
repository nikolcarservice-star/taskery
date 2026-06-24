import { AdminDesktopShell } from "@/components/admin/AdminDesktopShell";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { localizeAdminTab } from "@/lib/admin-i18n";
import { resolveAdminTabFromPath } from "@/lib/admin-tabs";
import { getLocale } from "@/lib/i18n/server";
import { getAdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import { headers } from "next/headers";

type AdminPanelLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminPanelLayout({
  children,
}: AdminPanelLayoutProps) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/admin/overview";
  const locale = await getLocale();
  const { admin, permissions } = await getAdminPageContext(pathname);
  const badges = await getAdminMobileBadges(permissions, admin.id);
  const activeTab = localizeAdminTab(
    resolveAdminTabFromPath(pathname, permissions),
    locale,
  );

  return (
    <AdminDesktopShell
      permissions={permissions}
      badges={badges}
      activeTab={activeTab}
      locale={locale}
    >
      {children}
    </AdminDesktopShell>
  );
}
