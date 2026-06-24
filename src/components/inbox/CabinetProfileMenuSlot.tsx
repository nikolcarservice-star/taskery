"use client";

import { useCabinetInbox } from "@/components/inbox/CabinetInboxProvider";
import { ClientProfileMenu } from "@/components/ClientProfileMenu";
import { FreelancerProfileMenu } from "@/components/FreelancerProfileMenu";

type CabinetProfileMenuSlotProps = {
  role: "client" | "freelancer";
  userId: string;
  fallbackName?: string | null;
  showAdminPanel?: boolean;
};

export function CabinetProfileMenuSlot({
  role,
  userId,
  fallbackName = null,
  showAdminPanel = false,
}: CabinetProfileMenuSlotProps) {
  const inbox = useCabinetInbox();
  const name = inbox.user.name ?? fallbackName;
  const avatar = inbox.user.avatar;

  if (role === "client") {
    return (
      <ClientProfileMenu
        userId={userId}
        name={name}
        avatar={avatar}
        showAdminPanel={showAdminPanel}
      />
    );
  }

  return (
    <FreelancerProfileMenu
      userId={userId}
      name={name}
      avatar={avatar}
      showAdminPanel={showAdminPanel}
    />
  );
}
