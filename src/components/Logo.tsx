import Link from "next/link";
import { LogoMark } from "./LogoMark";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl" | "header";
  variant?: "default" | "inverted";
  className?: string;
  href?: string;
  showTagline?: boolean;
  hideTaglineOnMobile?: boolean;
  tagline?: string;
  homeAriaLabel?: string;
};

const markSizes = {
  sm: 28,
  md: 32,
  lg: 40,
  xl: 52,
  header: 36,
} as const;

const textSizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
  header: "text-lg",
} as const;

export function Logo({
  size = "md",
  variant = "default",
  className = "",
  href = "/",
  showTagline = false,
  hideTaglineOnMobile = false,
  tagline = "фриланс без риска",
  homeAriaLabel = "Taskery — на главную",
}: LogoProps) {
  const useTagline = showTagline || size === "header";
  const inverted = variant === "inverted";
  const titleClass = inverted ? "text-white" : "text-zinc-900";
  const accentClass = inverted ? "text-indigo-400" : "text-indigo-600";
  const taglineClass = inverted ? "text-zinc-500" : "text-zinc-400";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 ${className}`}
      aria-label={homeAriaLabel}
    >
      <LogoMark
        size={markSizes[size]}
        className="shrink-0 transition-transform duration-200 group-hover:scale-[1.03]"
      />
      {useTagline ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={`font-semibold tracking-tight ${titleClass} ${textSizes[size]}`}
          >
            Task<span className={accentClass}>ery</span>
          </span>
          <span
            className={`mt-1 text-[11px] font-normal tracking-wide ${taglineClass} ${
              hideTaglineOnMobile ? "hidden sm:block" : ""
            }`}
          >
            {tagline}
          </span>
        </span>
      ) : (
        <span
          className={`font-bold tracking-tight ${titleClass} ${textSizes[size]}`}
        >
          Task<span className={accentClass}>ery</span>
        </span>
      )}
    </Link>
  );
}
