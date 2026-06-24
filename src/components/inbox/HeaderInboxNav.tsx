"use client";

import { useCabinetInbox } from "@/components/inbox/CabinetInboxProvider";
import { MessagesNavButton } from "@/components/MessagesNavButton";
import { NotificationsNavButton } from "@/components/NotificationsNavButton";

type HeaderInboxNavProps = {
  variant?: "client" | "freelancer";
};

export function HeaderInboxNav({ variant = "freelancer" }: HeaderInboxNavProps) {
  const inbox = useCabinetInbox();

  return (
    <>
      <MessagesNavButton
        messages={inbox.messages}
        unreadCount={inbox.unreadMessages}
      />
      <NotificationsNavButton
        notifications={inbox.notifications}
        unreadCount={inbox.unreadNotifications}
        variant={variant}
      />
    </>
  );
}
