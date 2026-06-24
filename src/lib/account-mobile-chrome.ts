import type { Session } from "next-auth";
import { getAdminWorkMode } from "@/lib/admin-work-mode";
import { prisma } from "@/lib/prisma";

export type AccountMobileRole = "client" | "freelancer";

export type AccountMobileChromeProps = {
  role: AccountMobileRole;
  isAdmin: boolean;
  userName: string | null;
  userAvatar: string | null;
};

export async function resolveAccountMobileRole(
  session: Session,
): Promise<AccountMobileRole | null> {
  if (session.user.role === "CLIENT") {
    return "client";
  }

  if (session.user.role === "FREELANCER") {
    return "freelancer";
  }

  if (session.user.role === "ADMIN") {
    const workMode = await getAdminWorkMode();
    if (workMode === "client") {
      return "client";
    }
    if (workMode === "freelancer") {
      return "freelancer";
    }
  }

  return null;
}

export async function getAccountMobileChromeProps(
  session: Session,
): Promise<AccountMobileChromeProps | null> {
  const role = await resolveAccountMobileRole(session);
  if (!role) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, avatar: true, pendingAvatar: true },
  });

  return {
    role,
    isAdmin: session.user.role === "ADMIN",
    userName: user?.name ?? session.user.name ?? null,
    userAvatar: user?.avatar ?? user?.pendingAvatar ?? null,
  };
}
