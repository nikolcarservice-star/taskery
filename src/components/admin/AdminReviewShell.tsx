import Link from "next/link";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AppLocale } from "@/lib/i18n/types";

type AdminReviewShellProps = {
  locale: AppLocale;
  title: string;
  subtitle?: string;
  backHref?: string;
  children: React.ReactNode;
};

export function AdminReviewShell({
  locale,
  title,
  subtitle,
  backHref = "/admin",
  children,
}: AdminReviewShellProps) {
  const copy = getAdminCopy(locale);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800"
        >
          {copy.review.backToModeration}
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50/50 to-white shadow-sm">
        <div className="border-b border-zinc-100 bg-zinc-50/80 px-4 py-4 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
            {copy.review.moderationReview}
          </p>
          <h1 className="mt-1 text-lg font-bold text-zinc-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>
          )}
          <p className="mt-2 text-xs text-zinc-500">{copy.review.adminCanWriteHint}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
