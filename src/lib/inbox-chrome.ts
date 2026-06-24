import {
  getRecentInboxMessagePreviews,
  getUnreadInboxMessageCount,
} from "@/lib/messages-inbox";
import {
  getUnreadNotificationCount,
  getUserNotifications,
} from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { getUserSettings } from "@/lib/settings";

export async function getInboxChromeData(userId: string) {
  const [
    unreadMessages,
    unreadNotifications,
    messages,
    notifications,
    settings,
    user,
  ] = await Promise.all([
    getUnreadInboxMessageCount(userId),
    getUnreadNotificationCount(userId),
    getRecentInboxMessagePreviews(userId, 8),
    getUserNotifications(userId, 8),
    getUserSettings(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, avatar: true, pendingAvatar: true },
    }),
  ]);

  const displayAvatar = user?.avatar ?? user?.pendingAvatar ?? null;

  return {
    unreadMessages,
    unreadNotifications,
    messages,
    notifications,
    soundEnabled: settings.soundNewMessages,
    user: {
      name: user?.name ?? null,
      avatar: displayAvatar,
    },
  };
}
