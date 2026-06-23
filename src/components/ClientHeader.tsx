import { ClientFreelancersNavLink } from "@/components/ClientFreelancersNavLink";
import { ClientHeaderActions } from "@/components/ClientHeaderActions";
import { ClientProfileMenu } from "@/components/ClientProfileMenu";
import {
  HeaderShell,
} from "@/components/HeaderShell";
import { MessagesNavButton } from "@/components/MessagesNavButton";
import { MyProjectsNavLink } from "@/components/MyProjectsNavLink";
import { NotificationsNavButton } from "@/components/NotificationsNavButton";
import { auth } from "@/lib/auth";
import { hasActiveClientProjects } from "@/lib/client-projects";
import {
  getRecentInboxMessagePreviews,
  getUnreadInboxMessageCount,
} from "@/lib/messages-inbox";
import {
  getUnreadNotificationCount,
  getUserNotifications,
} from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export async function ClientHeader() {
  const session = await auth();

  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true, avatar: true },
      })
    : null;

  const hasActiveProjects = session?.user?.id
    ? await hasActiveClientProjects(session.user.id)
    : false;

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

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <HeaderShell
      showTagline
      variant="cabinet"
      logoHref="/client"
      end={
        <nav className="flex items-center">
          <div className="hidden items-center gap-x-6 lg:flex lg:gap-x-8">
            <MyProjectsNavLink hasActiveProjects={hasActiveProjects} />
            <ClientFreelancersNavLink />
          </div>

          <ClientHeaderActions isAdmin={isAdmin} />

          <div className="flex items-center gap-x-0.5 lg:ml-4 lg:border-l lg:border-zinc-200 lg:pl-5">
            <MessagesNavButton
              messages={recentMessages}
              unreadCount={unreadMessages}
            />

            <NotificationsNavButton
              notifications={recentNotifications}
              unreadCount={unreadNotifications}
              variant="client"
            />

            <ClientProfileMenu
              userId={user?.id ?? session?.user?.id ?? ""}
              name={user?.name ?? null}
              avatar={user?.avatar ?? null}
              showAdminPanel={isAdmin}
            />
          </div>
        </nav>
      }
    />
  );
}
