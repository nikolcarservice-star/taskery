import { FreelancerHeaderActions } from "@/components/FreelancerHeaderActions";
import {
  HeaderShell,
} from "@/components/HeaderShell";
import { HeaderInboxNav } from "@/components/inbox/HeaderInboxNav";
import { CabinetProfileMenuSlot } from "@/components/inbox/CabinetProfileMenuSlot";
import { MyTasksNavLink } from "@/components/MyTasksNavLink";
import { NoActiveTasksHintProvider } from "@/components/NoActiveTasksHintProvider";
import { auth } from "@/lib/auth";
import { hasActiveFreelancerTasks, getActiveFreelancerContracts } from "@/lib/freelancer-tasks";
import type { ActiveTaskPreview } from "@/lib/tasks-shared";

export async function FreelancerHeader() {
  const session = await auth();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  const [hasActiveTasks, activeTasksRaw] = userId
    ? await Promise.all([
        hasActiveFreelancerTasks(userId),
        getActiveFreelancerContracts(userId, {
          orderBy: { updatedAt: "desc" },
          take: 8,
        }),
      ])
    : [false, []];

  const activeTasks: ActiveTaskPreview[] = activeTasksRaw.map((contract) => ({
    id: contract.id,
    projectTitle: contract.project.title,
    projectSlug: contract.project.slug,
    clientName: contract.client.name,
    amount: contract.amount.toString(),
    currency: contract.project.currency,
    status: contract.status,
  }));

  return (
    <NoActiveTasksHintProvider enabled={!hasActiveTasks}>
      <HeaderShell
        showTagline
        variant="cabinet"
        logoHref="/dashboard"
        end={
          <nav className="flex items-center">
            <div className="hidden items-center gap-x-6 lg:flex lg:gap-x-8">
              <MyTasksNavLink tasks={activeTasks} />
            </div>

            <FreelancerHeaderActions isAdmin={isAdmin} />

            <div className="flex items-center gap-x-0.5 lg:ml-4 lg:border-l lg:border-zinc-200 lg:pl-5">
              <HeaderInboxNav variant="freelancer" />
              <CabinetProfileMenuSlot
                role="freelancer"
                userId={userId ?? ""}
                fallbackName={session?.user?.name ?? null}
                showAdminPanel={isAdmin}
              />
            </div>
          </nav>
        }
      />
    </NoActiveTasksHintProvider>
  );
}
