"use client";

type AdminTabNavItem<T extends string> = {
  id: T;
  label: string;
  badge?: number;
};

type AdminTabNavProps<T extends string> = {
  tabs: AdminTabNavItem<T>[];
  active: T;
  onChange: (tab: T) => void;
  size?: "md" | "sm";
  className?: string;
  ariaLabel?: string;
};

export function AdminTabNav<T extends string>({
  tabs,
  active,
  onChange,
  size = "md",
  className = "",
  ariaLabel = "Admin panel sections",
}: AdminTabNavProps<T>) {
  const isSmall = size === "sm";

  return (
    <div
      className={`overflow-x-auto ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      <div
        className={`inline-flex min-w-full gap-1 rounded-2xl border border-zinc-200 bg-zinc-100/90 p-1 shadow-inner ${
          isSmall ? "sm:min-w-0" : ""
        }`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          const hasBadge = tab.badge !== undefined && tab.badge > 0;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`relative flex shrink-0 items-center gap-2 rounded-xl font-semibold transition-all ${
                isSmall ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"
              } ${
                isActive
                  ? "bg-white text-red-700 shadow-sm ring-1 ring-zinc-200/80"
                  : "text-zinc-600 hover:bg-white/70 hover:text-zinc-900"
              }`}
            >
              <span>{tab.label}</span>
              {hasBadge && (
                <span
                  className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold leading-5 ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "bg-zinc-300 text-zinc-800"
                  }`}
                >
                  {tab.badge! > 99 ? "99+" : tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
