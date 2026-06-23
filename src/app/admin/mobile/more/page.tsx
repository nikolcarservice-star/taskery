import { AdminMobileMore } from "@/components/admin/mobile/AdminMobileMore";
import { getAdminPageContext } from "@/lib/admin-page-context";

export default async function AdminMobileMorePage() {
  const { admin, permissions } = await getAdminPageContext(
    "/admin/mobile/more",
  );

  return (
    <AdminMobileMore permissions={permissions} adminEmail={admin.email} />
  );
}
