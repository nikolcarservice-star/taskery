import { AccountPageCard } from "@/components/account/AccountPageCard";
import { MarketingPageShell } from "@/components/account/MarketingPageShell";
import { ClientCabinetShell } from "@/components/ClientCabinetShell";
import { FreelancerCabinetShell } from "@/components/FreelancerCabinetShell";
import { auth } from "@/lib/auth";
import { resolveAccountMobileRole } from "@/lib/account-mobile-chrome";
import type { AppLocale, Dictionary } from "@/lib/i18n/types";
import type { ReactNode } from "react";

type AccountBrowsePageProps = {
  locale: AppLocale;
  dict: Dictionary;
  callbackUrl: string;
  children: ReactNode;
  card?: boolean;
  cardClassName?: string;
  marketingMainClassName?: string;
};

export async function AccountBrowsePage({
  locale,
  dict,
  callbackUrl,
  children,
  card = true,
  cardClassName = "",
  marketingMainClassName,
}: AccountBrowsePageProps) {
  const session = await auth();
  const role = session?.user ? await resolveAccountMobileRole(session) : null;

  const body = card ? (
    <AccountPageCard className={cardClassName}>{children}</AccountPageCard>
  ) : (
    children
  );

  if (role === "client") {
    return (
      <ClientCabinetShell callbackUrl={callbackUrl}>{body}</ClientCabinetShell>
    );
  }

  if (role === "freelancer") {
    return (
      <FreelancerCabinetShell callbackUrl={callbackUrl}>{body}</FreelancerCabinetShell>
    );
  }

  return (
    <MarketingPageShell
      locale={locale}
      dict={dict}
      mainClassName={marketingMainClassName}
    >
      {children}
    </MarketingPageShell>
  );
}
