type VerifiedBadgeProps = {
  className?: string;
  title?: string;
};

export function VerifiedBadge({
  className = "",
  title = "Verified profile",
}: VerifiedBadgeProps) {
  return (
    <span
      title={title}
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold text-white ${className}`}
      aria-label={title}
    >
      ✓
    </span>
  );
}
