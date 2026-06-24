import type { AdminTabDefinition } from "@/lib/admin-tabs";

export const ADMIN_MOBILE_NAV_HEIGHT = "0px";

type AdminMobileHeaderProps = {
  adminName: string | null;
  activeTab: AdminTabDefinition;
};

export function AdminMobileHeader({
  adminName,
  activeTab,
}: AdminMobileHeaderProps) {
  return (
    <header className="admin-mobile-header sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl">
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))" }}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
            Taskery Admin
          </p>
          <h1 className="truncate text-lg font-bold text-zinc-900">
            {activeTab.label}
          </h1>
        </div>
        <div className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-red-100">
          {adminName ?? "Админ"}
        </div>
      </div>
    </header>
  );
}
