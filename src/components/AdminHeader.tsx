import { AdminModeLink } from "@/components/AdminModeLink";
import { AdminPanelNavButton } from "@/components/AdminPanelNavButton";
import { AdminProfileMenu } from "@/components/AdminProfileMenu";
import {
  HeaderShell,
  headerNavLinkClass,
} from "@/components/HeaderShell";
import { HeaderInboxNav } from "@/components/inbox/HeaderInboxNav";
import { auth } from "@/lib/auth";
import { getAdminCopy } from "@/lib/admin-i18n";
import { getLocale } from "@/lib/i18n/server";

export async function AdminHeader() {
  const session = await auth();
  const locale = await getLocale();
  const chrome = getAdminCopy(locale).panels.chrome;

  return (
    <HeaderShell
      logoHref="/cabinet"
      end={
        <nav className="flex items-center">
          <div className="hidden items-center gap-x-6 lg:flex lg:gap-x-8">
            <AdminModeLink mode="client" href="/client" className={headerNavLinkClass}>
              {chrome.workAsClient}
            </AdminModeLink>
            <AdminModeLink mode="freelancer" href="/dashboard" className={headerNavLinkClass}>
              {chrome.workAsFreelancer}
            </AdminModeLink>
          </div>

          <div className="ml-6 hidden items-center gap-x-3 lg:ml-10 lg:flex lg:gap-x-4">
            <AdminPanelNavButton />
          </div>

          <div className="flex items-center gap-x-0.5 lg:ml-6 lg:border-l lg:border-zinc-200 lg:pl-5">
            <HeaderInboxNav variant="client" />
            <AdminProfileMenu
              name={session?.user?.name ?? null}
              avatar={null}
              locale={locale}
            />
          </div>
        </nav>
      }
    />
  );
}
