import { FreelancerHeader } from "@/components/FreelancerHeader";
import { InboxRefreshPoller } from "@/components/InboxRefreshPoller";
import { FreelancerSidebar } from "@/components/FreelancerSidebar";
import { MessageSoundWatcher } from "@/components/MessageSoundWatcher";
import { PageBackNav } from "@/components/PageBackNav";
import { getUnreadInboxMessageCount } from "@/lib/messages-inbox";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { getUserSettings } from "@/lib/settings";
import { requireFreelancer } from "@/lib/session";



type FreelancerCabinetShellProps = {

  children: React.ReactNode;

  callbackUrl?: string;

};



export async function FreelancerCabinetShell({

  children,

  callbackUrl = "/dashboard",

}: FreelancerCabinetShellProps) {

  const session = await requireFreelancer(callbackUrl);



  const user = await prisma.user.findUnique({

    where: { id: session.user.id },

    select: { id: true },

  });



  if (!user) {

    return null;

  }



  const isAdmin = session.user.role === "ADMIN";

  const [settings, unreadMessages, unreadNotifications] = await Promise.all([
    getUserSettings(session.user.id),
    getUnreadInboxMessageCount(session.user.id),
    getUnreadNotificationCount(session.user.id),
  ]);

  return (
    <div className="cabinet-app-shell flex min-h-full flex-1 flex-col bg-zinc-100">
      <MessageSoundWatcher
        enabled={settings.soundNewMessages}
        initialUnreadCount={unreadMessages}
        initialNotificationCount={unreadNotifications}
      />
      <FreelancerHeader />



      <div className="cabinet-app-content mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-4 lg:px-6 lg:py-6">

        <FreelancerSidebar isAdmin={isAdmin} />

        <div className="min-w-0 flex-1">

          <PageBackNav className="mb-4 lg:mb-5" />

          {children}

        </div>

      </div>

    </div>

  );

}


