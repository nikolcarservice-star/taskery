import { FreelancerHeader } from "@/components/FreelancerHeader";
import { FreelancerSidebar } from "@/components/FreelancerSidebar";
import { PageBackNav } from "@/components/PageBackNav";
import { requireFreelancer } from "@/lib/session";

type FreelancerCabinetShellProps = {
  children: React.ReactNode;
  callbackUrl?: string;
};

export async function FreelancerCabinetShell({
  children,
  callbackUrl = "/dashboard",
}: FreelancerCabinetShellProps) {
  const session = await requireFreelancer(callbackUrl);
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="cabinet-app-shell flex min-h-full flex-1 flex-col bg-zinc-100">
      <FreelancerHeader />

      <div className="cabinet-app-content mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-4 lg:px-6 lg:py-6">
        <FreelancerSidebar isAdmin={isAdmin} />
        <div className="min-w-0 flex-1">
          <PageBackNav className="mb-4 lg:mb-5" />
          {children}
        </div>
      </div>
    </div>
  );
}
