import { FreelancerCabinetShell } from "@/components/FreelancerCabinetShell";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const locale = await requireAppLocale(params);
  const callbackUrl = localizedPath(locale, "/dashboard");

  return (
    <FreelancerCabinetShell callbackUrl={callbackUrl}>
      {children}
    </FreelancerCabinetShell>
  );
}
