import { LocalizedHeaderLogo } from "@/components/LocalizedHeaderLogo";
import { Logo } from "@/components/Logo";
import type { ReactNode } from "react";

export const HEADER_HEIGHT_CLASS = "h-[68px]";

export const headerNavLinkClass =
  "px-1 py-2 text-[15px] font-medium text-zinc-600 transition-colors hover:text-zinc-900";

export const headerNavLinkMutedClass =
  "cursor-default px-1 py-2 text-[15px] font-medium text-zinc-400";

export const headerGhostButtonClass =
  "rounded-lg border border-indigo-600/80 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:border-indigo-600 hover:bg-indigo-50/80";

export const headerPrimaryButtonClass =
  "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700";

export const headerIconButtonClass =
  "rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800";

type HeaderShellProps = {
  end?: ReactNode;
  showTagline?: boolean;
  logoHref?: string;
  variant?: "default" | "cabinet";
};

export function HeaderShell({
  end,
  showTagline = false,
  logoHref = "/",
  variant = "default",
}: HeaderShellProps) {
  const isCabinet = variant === "cabinet";

  return (
    <>
      <header
        className="site-chrome-header fixed inset-x-0 top-0 z-50 overflow-visible border-b border-zinc-200/80 bg-white/95 font-sans backdrop-blur-sm"
      >
        <div
          className={`mx-auto flex w-full max-w-[1440px] items-center justify-between overflow-visible ${
            isCabinet
              ? "h-[68px] gap-8 px-10 xl:px-12"
              : `gap-8 px-6 sm:px-8 lg:px-10 xl:px-12 ${HEADER_HEIGHT_CLASS}`
          }`}
        >
          {showTagline ? (
            <LocalizedHeaderLogo
              href={logoHref}
              className="shrink-0"
              hideTaglineOnMobile={isCabinet}
            />
          ) : (
            <Logo
              size="lg"
              href={logoHref}
              className="shrink-0"
            />
          )}
          {end ? (
            <div className="flex min-w-0 items-center justify-end overflow-visible">
              {end}
            </div>
          ) : null}
        </div>
      </header>
      <div
        aria-hidden
        className={`site-chrome-header-spacer shrink-0 ${isCabinet ? "h-[68px]" : HEADER_HEIGHT_CLASS}`}
      />
    </>
  );
}
