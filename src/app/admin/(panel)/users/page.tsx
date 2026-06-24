import { AdminUsersSection } from "@/components/admin/sections/AdminUsersSection";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { getLocale } from "@/lib/i18n/server";
import { getPendingProfileVerifications } from "@/lib/queries/admin-verification";
import { getAdminUsers } from "@/lib/queries/admin-users";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminUsersPage() {
  const { permissions } = await getAdminPageContext("/admin/users");

  if (!hasAdminPermission(permissions, "USERS")) {
    redirect("/admin/overview");
  }

  const locale = await getLocale();

  const [verificationItems, users] = await Promise.all([
    getPendingProfileVerifications(),
    getAdminUsers(),
  ]);

  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-zinc-100" />}>
      <AdminUsersSection
        verificationItems={verificationItems}
        users={users}
        locale={locale}
      />
    </Suspense>
  );
}
