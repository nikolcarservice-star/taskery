import { AdminHeader } from "@/components/AdminHeader";
import { AdminSidebar } from "@/components/AdminSidebar";
import { PageBackNav } from "@/components/PageBackNav";
import { requireAdmin } from "@/lib/session";

type AdminCabinetShellProps = {
  children: React.ReactNode;
  callbackUrl?: string;
};

export async function AdminCabinetShell({
  children,
  callbackUrl = "/cabinet",
}: AdminCabinetShellProps) {
  await requireAdmin(callbackUrl);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-100">
      <AdminHeader />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-3 py-3 sm:px-4 sm:py-4 lg:flex-row lg:gap-6 lg:px-6 lg:py-6">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <PageBackNav className="mb-3 lg:mb-5" />
          {children}
        </div>
      </div>
    </div>
  );
}
