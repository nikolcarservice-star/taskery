"use client";

import { usePathname } from "next/navigation";
import { CabinetBottomNav } from "@/components/cabinet/CabinetBottomNav";
import { useCabinetInbox } from "@/components/inbox/CabinetInboxProvider";
import { isAccountMobileAppPath } from "@/lib/account-routes";
import type { AccountMobileChromeProps } from "@/lib/account-mobile-chrome";
import { stripLocalePrefix } from "@/lib/i18n/routing";

export function AccountMobileApp(props: AccountMobileChromeProps) {
  const pathname = usePathname();
  const path = stripLocalePrefix(pathname);
  const active = isAccountMobileAppPath(path);
  const inbox = useCabinetInbox();

  if (!active) {
    return null;
  }

  return (
    <CabinetBottomNav
      {...props}
      userName={inbox.user.name ?? props.userName}
      userAvatar={inbox.user.avatar ?? props.userAvatar}
      unreadMessages={inbox.unreadMessages}
      unreadNotifications={inbox.unreadNotifications}
    />
  );
}
