import { AdminUsersPanel } from "@/components/AdminUsersPanel";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getAdminUsers } from "@/lib/queries/admin-users";
import type { Role } from "@/generated/prisma/client";
import { redirect } from "next/navigation";

type AdminMobileUsersPageProps = {
  searchParams: Promise<{
    q?: string;
    role?: string;
    status?: string;
  }>;
};

export default async function AdminMobileUsersPage({
  searchParams,
}: AdminMobileUsersPageProps) {
  const { permissions } = await getAdminPageContext(
    `${ADMIN_MOBILE_ROOT}/users`,
  );

  if (!hasAdminPermission(permissions, "USERS")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const params = await searchParams;
  const q = params.q?.trim();
  const role =
    params.role === "CLIENT" || params.role === "FREELANCER"
      ? (params.role as Role)
      : undefined;
  const status =
    params.status === "active" ||
    params.status === "banned" ||
    params.status === "deleted"
      ? params.status
      : "all";

  const users = await getAdminUsers({ q, role, status });

  return (
    <AdminUsersPanel
      users={users}
      mobile
      initialQuery={q ?? ""}
      initialRole={role ?? "ALL"}
      initialStatus={status}
    />
  );
}
