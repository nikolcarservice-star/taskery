import { AdminModeLink } from "@/components/AdminModeLink";
import { AdminPanelNavButton } from "@/components/AdminPanelNavButton";
import { AdminProfileMenu } from "@/components/AdminProfileMenu";
import {
  HeaderShell,
  headerNavLinkClass,
} from "@/components/HeaderShell";
import { MessagesNavButton } from "@/components/MessagesNavButton";
import { NotificationsNavButton } from "@/components/NotificationsNavButton";
import { auth } from "@/lib/auth";
import {
  getRecentInboxMessagePreviews,
  getUnreadInboxMessageCount,
} from "@/lib/messages-inbox";
import {
  getUnreadNotificationCount,
  getUserNotifications,
} from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export async function AdminHeader() {
  const session = await auth();

  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true, avatar: true },
      })
    : null;

  const unreadNotifications = session?.user?.id
    ? await getUnreadNotificationCount(session.user.id)
    : 0;

  const recentNotifications = session?.user?.id
    ? await getUserNotifications(session.user.id, 8)
    : [];

  const unreadMessages = session?.user?.id
    ? await getUnreadInboxMessageCount(session.user.id)
    : 0;

  const recentMessages = session?.user?.id
    ? await getRecentInboxMessagePreviews(session.user.id, 8)
    : [];

  return (
    <HeaderShell
      logoHref="/cabinet"
      end={
        <nav className="flex items-center">
          <div className="flex items-center gap-x-6 lg:gap-x-8">
            <AdminModeLink mode="client" href="/client" className={headerNavLinkClass}>
              Как заказчик
            </AdminModeLink>
            <AdminModeLink mode="freelancer" href="/dashboard" className={headerNavLinkClass}>
              Как фрилансер
            </AdminModeLink>
          </div>

          <div className="ml-6 flex items-center gap-x-3 lg:ml-10 lg:gap-x-4">
            <AdminPanelNavButton />
          </div>

          <div className="ml-4 flex items-center gap-x-0.5 border-l border-zinc-200 pl-4 lg:ml-6 lg:pl-5">
            <MessagesNavButton
              messages={recentMessages}
              unreadCount={unreadMessages}
            />

            <NotificationsNavButton
              notifications={recentNotifications}
              unreadCount={unreadNotifications}
              variant="client"
            />

            <AdminProfileMenu
              name={user?.name ?? null}
              avatar={user?.avatar ?? null}
            />
          </div>
        </nav>
      }
    />
  );
}
