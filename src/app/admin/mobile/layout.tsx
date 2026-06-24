import { AdminMobileShell } from "@/components/admin/mobile/AdminMobileShell";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { localizeAdminTab } from "@/lib/admin-i18n";
import { resolveAdminTabFromPath } from "@/lib/admin-tabs";
import { getLocale } from "@/lib/i18n/server";
import { getAdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import { headers } from "next/headers";

export const metadata = {
  title: "Админ — Taskery",
  robots: { index: false, follow: false },
};

type AdminMobileLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminMobileLayout({
  children,
}: AdminMobileLayoutProps) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/admin/mobile";
  const locale = await getLocale();
  const { admin, permissions } = await getAdminPageContext(pathname);
  const badges = await getAdminMobileBadges(permissions, admin.id);
  const activeTab = localizeAdminTab(
    resolveAdminTabFromPath(pathname, permissions),
    locale,
  );

  return (
    <AdminMobileShell
      permissions={permissions}
      badges={badges}
      adminName={admin.name}
      activeTab={activeTab}
      locale={locale}
    >
      {children}
    </AdminMobileShell>
  );
}
