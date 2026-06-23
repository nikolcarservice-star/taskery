import type { ReactNode } from "react";

type AccountPageCardProps = {
  children: ReactNode;
  className?: string;
  flush?: boolean;
};

export function AccountPageCard({
  children,
  className = "",
  flush = false,
}: AccountPageCardProps) {
  if (flush) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:rounded-xl sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}
