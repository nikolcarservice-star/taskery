import { AdminMobileMore } from "@/components/admin/mobile/AdminMobileMore";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { getLocale } from "@/lib/i18n/server";

export default async function AdminMobileMorePage() {
  const { admin, permissions } = await getAdminPageContext("/admin/mobile/more");
  const locale = await getLocale();

  return (
    <AdminMobileMore
      adminEmail={admin.email}
      permissions={permissions}
      locale={locale}
    />
  );
}
