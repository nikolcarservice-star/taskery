import { ClientFreelancersNavLink } from "@/components/ClientFreelancersNavLink";
import { ClientHeaderActions } from "@/components/ClientHeaderActions";
import {
  HeaderShell,
} from "@/components/HeaderShell";
import { HeaderInboxNav } from "@/components/inbox/HeaderInboxNav";
import { CabinetProfileMenuSlot } from "@/components/inbox/CabinetProfileMenuSlot";
import { MyProjectsNavLink } from "@/components/MyProjectsNavLink";
import { auth } from "@/lib/auth";
import { hasActiveClientProjects } from "@/lib/client-projects";

export async function ClientHeader() {
  const session = await auth();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  const hasActiveProjects = userId ? await hasActiveClientProjects(userId) : false;

  return (
    <HeaderShell
      showTagline
      variant="cabinet"
      logoHref="/client"
      end={
        <nav className="flex items-center">
          <div className="hidden items-center gap-x-6 lg:flex lg:gap-x-8">
            <MyProjectsNavLink hasActiveProjects={hasActiveProjects} />
            <ClientFreelancersNavLink />
          </div>

          <ClientHeaderActions isAdmin={isAdmin} />

          <div className="flex items-center gap-x-0.5 lg:ml-4 lg:border-l lg:border-zinc-200 lg:pl-5">
            <HeaderInboxNav variant="client" />
            <CabinetProfileMenuSlot
              role="client"
              userId={userId ?? ""}
              fallbackName={session?.user?.name ?? null}
              showAdminPanel={isAdmin}
            />
          </div>
        </nav>
      }
    />
  );
}
