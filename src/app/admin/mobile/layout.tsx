import { AdminMobileShell } from "@/components/admin/mobile/AdminMobileShell";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { getAdminMobileBadges } from "@/lib/queries/admin-mobile-badges";

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
  const { admin, permissions } = await getAdminPageContext("/admin/mobile");
  const badges = await getAdminMobileBadges(permissions);

  return (
    <AdminMobileShell
      permissions={permissions}
      badges={badges}
      adminName={admin.name}
    >
      {children}
    </AdminMobileShell>
  );
}
