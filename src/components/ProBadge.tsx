export function ProBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white ${className}`}
    >
      Boost
    </span>
  );
}
