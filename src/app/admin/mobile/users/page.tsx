import { AdminUsersSection } from "@/components/admin/sections/AdminUsersSection";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { getPendingProfileVerifications } from "@/lib/queries/admin-verification";
import { getAdminUsers } from "@/lib/queries/admin-users";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminMobileUsersPage() {
  const { permissions } = await getAdminPageContext(`${ADMIN_MOBILE_ROOT}/users`);

  if (!hasAdminPermission(permissions, "USERS")) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  const [verificationItems, users] = await Promise.all([
    getPendingProfileVerifications(),
    getAdminUsers(),
  ]);

  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-zinc-100" />}>
      <AdminUsersSection
        basePath={`${ADMIN_MOBILE_ROOT}/users`}
        verificationItems={verificationItems}
        users={users}
      />
    </Suspense>
  );
}
