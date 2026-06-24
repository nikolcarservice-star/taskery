import { AdminMobileMore } from "@/components/admin/mobile/AdminMobileMore";
import { getAdminPageContext } from "@/lib/admin-page-context";

export default async function AdminMobileMorePage() {
  const { admin } = await getAdminPageContext("/admin/mobile/more");

  return <AdminMobileMore adminEmail={admin.email} />;
}
