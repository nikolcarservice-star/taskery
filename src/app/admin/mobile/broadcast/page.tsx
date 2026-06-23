import { AdminBroadcastPanel } from "@/components/AdminBroadcastPanel";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminMobileBroadcastPage() {
  const { permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/broadcast`,
  );

  if (!hasAdminPermission(permissions, "STAFF_MANAGE")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const [freelancerCount, clientCount] = await Promise.all([
    prisma.user.count({ where: { role: "FREELANCER", deletedAt: null } }),
    prisma.user.count({ where: { role: "CLIENT", deletedAt: null } }),
  ]);

  return (
    <AdminBroadcastPanel
      stats={{ freelancers: freelancerCount, clients: clientCount }}
      compact
    />
  );
}
