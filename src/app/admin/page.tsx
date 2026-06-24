import { AdminLoginView } from "@/components/AdminLoginView";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getHomeRouteForRole } from "@/lib/role-redirect";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Админ — Taskery",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return <AdminLoginView />;
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
