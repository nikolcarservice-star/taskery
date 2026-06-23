import { ClientCabinetShell } from "@/components/ClientCabinetShell";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";

type ClientLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function ClientLayout({
  children,
  params,
}: ClientLayoutProps) {
  const locale = await requireAppLocale(params);
  const callbackUrl = localizedPath(locale, "/client");

  return (
    <ClientCabinetShell callbackUrl={callbackUrl}>{children}</ClientCabinetShell>
  );
}
