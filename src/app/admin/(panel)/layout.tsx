import { AdminDesktopShell } from "@/components/admin/AdminDesktopShell";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { resolveAdminTabFromPath } from "@/lib/admin-tabs";
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
  const { admin, permissions } = await getAdminPageContext(pathname);
  const badges = await getAdminMobileBadges(permissions, admin.id);
  const activeTab = resolveAdminTabFromPath(pathname, permissions);

  return (
    <AdminDesktopShell
      permissions={permissions}
      badges={badges}
      activeTab={activeTab}
    >
      {children}
    </AdminDesktopShell>
  );
}
