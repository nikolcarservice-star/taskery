import { FreelancerCompetitionsNav } from "@/components/FreelancerCompetitionsNav";
import { FreelancerHeaderActions } from "@/components/FreelancerHeaderActions";
import { FreelancerProfileMenu } from "@/components/FreelancerProfileMenu";
import {
  HeaderShell,
} from "@/components/HeaderShell";
import { MessagesNavButton } from "@/components/MessagesNavButton";
import { MyTasksNavLink } from "@/components/MyTasksNavLink";
import { NotificationsNavButton } from "@/components/NotificationsNavButton";
import { NoActiveTasksHintProvider } from "@/components/NoActiveTasksHintProvider";
import { auth } from "@/lib/auth";
import { hasActiveFreelancerTasks, getActiveFreelancerContracts } from "@/lib/freelancer-tasks";
import {
  getRecentInboxMessagePreviews,
  getUnreadInboxMessageCount,
} from "@/lib/messages-inbox";
import {
  getUnreadNotificationCount,
  getUserNotifications,
} from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import type { ActiveTaskPreview } from "@/lib/tasks-shared";

export async function FreelancerHeader() {
  const session = await auth();

  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true, avatar: true },
      })
    : null;

  const hasActiveTasks = session?.user?.id
    ? await hasActiveFreelancerTasks(session.user.id)
    : false;

  const activeTasks: ActiveTaskPreview[] = session?.user?.id
    ? (
        await getActiveFreelancerContracts(session.user.id, {
          orderBy: { updatedAt: "desc" },
          take: 8,
        })
      ).map((contract) => ({
        id: contract.id,
        projectTitle: contract.project.title,
        projectSlug: contract.project.slug,
        clientName: contract.client.name,
        amount: contract.amount.toString(),
        currency: contract.project.currency,
        status: contract.status,
      }))
    : [];

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
    <NoActiveTasksHintProvider enabled={!hasActiveTasks}>
      <HeaderShell
        showTagline
        variant="cabinet"
        logoHref="/dashboard"
        end={
          <nav className="flex items-center">
            <div className="hidden items-center gap-x-6 lg:flex lg:gap-x-8">
              <MyTasksNavLink tasks={activeTasks} />
              <FreelancerCompetitionsNav />
            </div>

            <FreelancerHeaderActions isAdmin={isAdmin} />

            <div className="flex items-center gap-x-0.5 lg:ml-4 lg:border-l lg:border-zinc-200 lg:pl-5">
              <MessagesNavButton
                messages={recentMessages}
                unreadCount={unreadMessages}
              />

              <NotificationsNavButton
                notifications={recentNotifications}
                unreadCount={unreadNotifications}
                variant="freelancer"
              />

              <FreelancerProfileMenu
                userId={user?.id ?? session?.user?.id ?? ""}
                name={user?.name ?? null}
                avatar={user?.avatar ?? null}
                showAdminPanel={isAdmin}
              />
            </div>
          </nav>
        }
      />
    </NoActiveTasksHintProvider>
  );
}
