import { ClientHeader } from "@/components/ClientHeader";
import { ClientSidebar } from "@/components/ClientSidebar";
import { MessageSoundWatcher } from "@/components/MessageSoundWatcher";
import { PageBackNav } from "@/components/PageBackNav";
import { getUserSettings } from "@/lib/settings";
import { getUnreadInboxMessageCount } from "@/lib/messages-inbox";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { requireClient } from "@/lib/session";



type ClientCabinetShellProps = {

  children: React.ReactNode;

  callbackUrl?: string;

};



export async function ClientCabinetShell({

  children,

  callbackUrl = "/client",

}: ClientCabinetShellProps) {

  const session = await requireClient(callbackUrl);

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
      <ClientHeader />



      <div className="cabinet-app-content mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-4 lg:px-6 lg:py-6">

        <ClientSidebar isAdmin={isAdmin} />

        <div className="min-w-0 flex-1">

          <PageBackNav className="mb-4 lg:mb-5" />

          {children}

        </div>

      </div>

    </div>

  );

}


