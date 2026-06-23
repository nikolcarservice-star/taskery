"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CabinetBottomNav } from "@/components/cabinet/CabinetBottomNav";
import { isAccountMobileAppPath } from "@/lib/account-routes";
import type { AccountMobileChromeProps } from "@/lib/account-mobile-chrome";
import { stripLocalePrefix } from "@/lib/i18n/routing";

export function AccountMobileApp(props: AccountMobileChromeProps) {
  const pathname = usePathname();
  const path = stripLocalePrefix(pathname);
  const active = isAccountMobileAppPath(path);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const syncBodyState = () => {
      if (mediaQuery.matches && active) {
        document.body.dataset.accountMobileApp = "true";
        return;
      }

      delete document.body.dataset.accountMobileApp;
    };

    syncBodyState();
    mediaQuery.addEventListener("change", syncBodyState);

    return () => {
      delete document.body.dataset.accountMobileApp;
      mediaQuery.removeEventListener("change", syncBodyState);
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return <CabinetBottomNav {...props} />;
}
