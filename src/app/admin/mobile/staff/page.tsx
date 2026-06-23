import {
  AdminStaffManager,
  type AdminStaffMember,
} from "@/components/AdminStaffManager";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminMobileStaffPage() {
  const { admin, permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/staff`,
  );

  if (!hasAdminPermission(permissions, "STAFF_MANAGE")) {
    redirect(`${ADMIN_MOBILE_ROOT}/more`);
  }

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: {
      id: true,
      name: true,
      email: true,
      adminPermissions: true,
      adminActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const staff: AdminStaffMember[] = admins.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <AdminStaffManager admins={staff} currentAdminId={admin.id} />
  );
}
