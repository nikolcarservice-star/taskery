"use client";

import { usePathname } from "next/navigation";
import { CabinetBottomNav } from "@/components/cabinet/CabinetBottomNav";
import { InboxRefreshPoller } from "@/components/InboxRefreshPoller";
import { isAccountMobileAppPath } from "@/lib/account-routes";
import type { AccountMobileChromeProps } from "@/lib/account-mobile-chrome";
import { stripLocalePrefix } from "@/lib/i18n/routing";

export function AccountMobileApp(props: AccountMobileChromeProps) {
  const pathname = usePathname();
  const path = stripLocalePrefix(pathname);
  const active = isAccountMobileAppPath(path);

  if (!active) {
    return null;
  }

  return (
    <>
      <InboxRefreshPoller />
      <CabinetBottomNav {...props} />
    </>
  );
}
