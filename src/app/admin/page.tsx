import { AdminLoginView } from "@/components/AdminLoginView";
import { auth } from "@/lib/auth";
import { getAdminCopy } from "@/lib/admin-i18n";
import { getLocale } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { getHomeRouteForRole } from "@/lib/role-redirect";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  const locale = await getLocale();
  const title = `${getAdminCopy(locale).panels.chrome.adminPanel} — Taskery`;

  return {
    title,
    robots: { index: false, follow: false },
  };
}

export default async function AdminLoginPage() {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user?.email) {
    return <AdminLoginView locale={locale} />;
  }

  if (session.user.role !== "ADMIN") {
    redirect(getHomeRouteForRole(session.user.role));
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { adminActive: true },
  });

  if (!admin?.adminActive) {
    redirect("/admin?error=deactivated");
  }

  redirect("/admin/overview");
}
