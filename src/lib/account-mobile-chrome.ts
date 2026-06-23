import type { Session } from "next-auth";
import { getAdminWorkMode } from "@/lib/admin-work-mode";
import { getUnreadInboxMessageCount } from "@/lib/messages-inbox";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export type AccountMobileRole = "client" | "freelancer";

export type AccountMobileChromeProps = {
  role: AccountMobileRole;
  unreadMessages: number;
  unreadNotifications: number;
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

  const [unreadMessages, unreadNotifications, user] = await Promise.all([
    getUnreadInboxMessageCount(session.user.id),
    getUnreadNotificationCount(session.user.id),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, avatar: true },
    }),
  ]);

  return {
    role,
    unreadMessages,
    unreadNotifications,
    isAdmin: session.user.role === "ADMIN",
    userName: user?.name ?? session.user.name ?? null,
    userAvatar: user?.avatar ?? null,
  };
}
