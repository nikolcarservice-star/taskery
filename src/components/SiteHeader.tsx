import { AdminHeader } from "@/components/AdminHeader";
import { ClientHeader } from "@/components/ClientHeader";
import { FreelancerHeader } from "@/components/FreelancerHeader";
import { GuestHeader } from "@/components/GuestHeader";
import { auth } from "@/lib/auth";
import { getAdminWorkMode } from "@/lib/admin-work-mode";
import { defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { AppLocale, Dictionary } from "@/lib/i18n/types";

type SiteHeaderProps = {
  locale?: AppLocale;
  dict?: Dictionary;
};

export async function SiteHeader({ locale = defaultLocale, dict }: SiteHeaderProps) {
  const session = await auth();
  const dictionary = dict ?? (await getDictionary(locale));

  if (session?.user?.role === "ADMIN") {
    const workMode = await getAdminWorkMode();

    if (workMode === "client") {
      return <ClientHeader />;
    }

    if (workMode === "freelancer") {
      return <FreelancerHeader />;
    }

    return <AdminHeader />;
  }

  if (session?.user?.role === "FREELANCER") {
    return <FreelancerHeader />;
  }

  if (session?.user?.role === "CLIENT") {
    return <ClientHeader />;
  }

  return <GuestHeader locale={locale} dict={dictionary} />;
}
