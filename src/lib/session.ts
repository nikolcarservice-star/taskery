import { Role } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { getHomeRouteForRole } from "@/lib/role-redirect";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function requireAuth(callbackUrl?: string) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(callbackUrl ?? "/profile")}`,
    );
  }

  return session;
}

export async function requireRole(allowed: Role[], callbackUrl?: string) {
  const session = await requireAuth(callbackUrl);

  if (!session.user.role || !allowed.includes(session.user.role)) {
    redirect(getHomeRouteForRole(session.user.role));
  }

  return session;
}

export async function requireClient(callbackUrl?: string) {
  return requireRole(["CLIENT", "ADMIN"], callbackUrl);
}

export async function requireFreelancer(callbackUrl?: string) {
  return requireRole(["FREELANCER", "ADMIN"], callbackUrl);
}

export async function requireAdmin(callbackUrl?: string) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect(
      `/admin?callbackUrl=${encodeURIComponent(callbackUrl ?? "/cabinet")}`,
    );
  }

  if (session.user.role !== "ADMIN") {
    redirect(getHomeRouteForRole(session.user.role));
  }

  if (!session.user.id) {
    redirect(
      `/admin?callbackUrl=${encodeURIComponent(callbackUrl ?? "/cabinet")}`,
    );
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { adminActive: true },
  });

  if (!admin?.adminActive) {
    redirect("/admin?error=deactivated");
  }

  return session;
}
