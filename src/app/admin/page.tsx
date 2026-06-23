import { AdminHeader } from "@/components/AdminHeader";
import { AdminLoginView } from "@/components/AdminLoginView";
import { AdminPanel } from "@/components/AdminPanel";
import { PageBackNav } from "@/components/PageBackNav";
import { SiteFooter } from "@/components/SiteFooter";
import { hasAdminPermission, isSuperAdmin } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAdminFinanceOverview } from "@/lib/queries/admin-finance";
import { getRecentAdminAuditLogs } from "@/lib/admin-audit";
import { getAdminCatalogOverview } from "@/lib/queries/admin-catalog";
import { getPendingProfileVerifications } from "@/lib/queries/admin-verification";
import { getModerationAttentionItems } from "@/lib/queries/admin-attention";
import { getPendingAdminReports } from "@/lib/queries/admin-reports";
import { getAdminUsers } from "@/lib/queries/admin-users";
import { getAdminSupportTickets } from "@/lib/queries/admin-support";
import { getPendingWithdrawals } from "@/lib/queries/admin-withdrawals";
import { getHomeRouteForRole } from "@/lib/role-redirect";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Админ — Taskery",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return <AdminLoginView />;
  }

  if (session.user.role !== "ADMIN") {
    redirect(getHomeRouteForRole(session.user.role));
  }

  const currentAdmin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      adminPermissions: true,
      adminActive: true,
    },
  });

  if (!currentAdmin?.adminActive) {
    redirect("/admin?error=deactivated");
  }

  const permissions = currentAdmin.adminPermissions;
  const canModerate = hasAdminPermission(permissions, "MODERATION");
  const canManageStaff = hasAdminPermission(permissions, "STAFF_MANAGE");
  const canViewUsers = hasAdminPermission(permissions, "USERS");
  const canViewFinance = hasAdminPermission(permissions, "FINANCE");

  const canViewAudit = canManageStaff || isSuperAdmin(permissions);

  const [
    disputes,
    openProjects,
    userCount,
    projectCount,
    freelancerCount,
    clientCount,
    admins,
    reports,
    attentionItems,
    users,
    finance,
    auditLogs,
    supportTickets,
    verificationItems,
    catalogOverview,
    pendingWithdrawals,
  ] = await Promise.all([
    canModerate
      ? prisma.project.findMany({
          where: { status: "UNDER_DISPUTE" },
          include: {
            client: { select: { name: true, email: true } },
            conversation: { select: { id: true } },
            contract: {
              include: {
                freelancer: { select: { name: true, email: true } },
              },
            },
          },
          orderBy: { updatedAt: "desc" },
        })
      : Promise.resolve([]),
    canModerate
      ? prisma.project.findMany({
          where: { status: "OPEN" },
          select: {
            id: true,
            slug: true,
            title: true,
            client: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        })
      : Promise.resolve([]),
    prisma.user.count(),
    prisma.project.count(),
    prisma.user.count({ where: { role: "FREELANCER" } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    canManageStaff
      ? prisma.user.findMany({
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
        })
      : Promise.resolve([]),
    canModerate ? getPendingAdminReports() : Promise.resolve([]),
    canModerate
      ? getModerationAttentionItems(currentAdmin.id)
      : Promise.resolve([]),
    canViewUsers ? getAdminUsers() : Promise.resolve([]),
    canViewFinance ? getAdminFinanceOverview() : Promise.resolve(null),
    canViewAudit ? getRecentAdminAuditLogs(30) : Promise.resolve([]),
    canModerate ? getAdminSupportTickets() : Promise.resolve([]),
    canViewUsers ? getPendingProfileVerifications() : Promise.resolve([]),
    canManageStaff ? getAdminCatalogOverview() : Promise.resolve(null),
    canViewFinance ? getPendingWithdrawals() : Promise.resolve([]),
  ]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <AdminHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <PageBackNav />
        <h1 className="text-3xl font-bold text-zinc-900">Админ-панель</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Модерация, пользователи, финансы и управление командой.
        </p>

        <div className="mt-8">
          <AdminPanel
            disputes={disputes}
            openProjects={openProjects}
            reports={reports}
            attentionItems={attentionItems}
            stats={{
              users: userCount,
              projects: projectCount,
              freelancers: freelancerCount,
              clients: clientCount,
            }}
            permissions={permissions}
            currentAdminId={currentAdmin.id}
            admins={admins.map((admin) => ({
              ...admin,
              createdAt: admin.createdAt.toISOString(),
            }))}
            users={users}
            finance={finance}
            auditLogs={auditLogs}
            supportTickets={supportTickets}
            verificationItems={verificationItems}
            catalogCategories={catalogOverview?.categories ?? []}
            catalogSkills={catalogOverview?.skills ?? []}
            pendingWithdrawals={pendingWithdrawals}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
