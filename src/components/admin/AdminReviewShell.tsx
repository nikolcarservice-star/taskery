import Link from "next/link";

type AdminReviewShellProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  children: React.ReactNode;
};

export function AdminReviewShell({
  title,
  subtitle,
  backHref = "/admin",
  children,
}: AdminReviewShellProps) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800"
        >
          ← Назад к модерации
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 bg-zinc-50/80 px-4 py-4 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
            Просмотр для модерации
          </p>
          <h1 className="mt-1 text-lg font-bold text-zinc-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>
          )}
          <p className="mt-2 text-xs text-zinc-500">
            Режим только для чтения — администратор не участвует в переписке
          </p>
        </div>
        <div className="max-h-[min(70dvh,720px)] overflow-y-auto bg-gradient-to-b from-zinc-50/50 to-white px-4 py-5 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}
