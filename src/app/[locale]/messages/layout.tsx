import { ClientCabinetShell } from "@/components/ClientCabinetShell";
import { FreelancerCabinetShell } from "@/components/FreelancerCabinetShell";
import { auth } from "@/lib/auth";
import { getAdminWorkMode } from "@/lib/admin-work-mode";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";

type MessagesLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MessagesLayout({
  children,
  params,
}: MessagesLayoutProps) {
  const locale = await requireAppLocale(params);
  const callbackUrl = localizedPath(locale, "/messages");
  const session = await auth();

  if (session?.user?.role === "FREELANCER") {
    return (
      <FreelancerCabinetShell callbackUrl={callbackUrl}>
        {children}
      </FreelancerCabinetShell>
    );
  }

  if (session?.user?.role === "CLIENT") {
    return (
      <ClientCabinetShell callbackUrl={callbackUrl}>
        {children}
      </ClientCabinetShell>
    );
  }

  if (session?.user?.role === "ADMIN") {
    const workMode = await getAdminWorkMode();

    if (workMode === "freelancer") {
      return (
        <FreelancerCabinetShell callbackUrl={callbackUrl}>
          {children}
        </FreelancerCabinetShell>
      );
    }

    return (
      <ClientCabinetShell callbackUrl={callbackUrl}>
        {children}
      </ClientCabinetShell>
    );
  }

  return children;
}
