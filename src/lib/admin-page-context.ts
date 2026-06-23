import { auth } from "@/lib/auth";
import type { AdminPermission } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getHomeRouteForRole } from "@/lib/role-redirect";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";

export type AdminPageContext = {
  session: Session;
  admin: {
    id: string;
    name: string | null;
    email: string;
    adminPermissions: AdminPermission[];
    adminActive: boolean;
  };
  permissions: AdminPermission[];
};

export async function getAdminPageContext(
  callbackUrl = "/admin/mobile",
): Promise<AdminPageContext> {
  const session = await auth();

  if (!session?.user?.email || !session.user.id) {
    redirect(
      `/admin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  if (session.user.role !== "ADMIN") {
    redirect(getHomeRouteForRole(session.user.role));
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      adminPermissions: true,
      adminActive: true,
    },
  });

  if (!admin?.adminActive) {
    redirect("/admin?error=deactivated");
  }

  return {
    session,
    admin,
    permissions: admin.adminPermissions,
  };
}
