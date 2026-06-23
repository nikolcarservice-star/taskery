import Link from "next/link";
import { AccountBrowsePage } from "@/components/account/AccountBrowsePage";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { getHomeRouteForRole } from "@/lib/role-redirect";

type BillingSuccessPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BillingSuccessPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  return createMetadata({
    title: dict.billing.success.title,
    description: dict.billing.success.description,
    path: "/billing/success",
    locale,
    noIndex: true,
  });
}

export default async function BillingSuccessPage({ params }: BillingSuccessPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const session = await auth();
  const homeHref = getHomeRouteForRole(session?.user?.role, locale);
  const financesHref =
    session?.user?.role === "CLIENT"
      ? localizedPath(locale, "/client/finances")
      : session?.user?.role === "FREELANCER"
        ? localizedPath(locale, "/dashboard/finances")
        : homeHref;

  return (
    <AccountBrowsePage
      locale={locale}
      dict={dict}
      callbackUrl="/billing/success"
      card={false}
      marketingMainClassName="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10 text-center sm:px-6 lg:py-16"
    >
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 sm:p-8">
        <p className="text-4xl">✓</p>
        <h1 className="account-mobile-title mt-4 text-xl font-bold text-zinc-900 sm:text-2xl">
          {dict.billing.success.heading}
        </h1>
        <p className="mt-3 text-sm text-zinc-600">{dict.billing.success.body}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            href={homeHref}
            className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            {dict.billing.success.toCabinet}
          </Link>
          {session?.user && (
            <Link
              href={financesHref}
              className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              {dict.billing.success.finances}
            </Link>
          )}
        </div>
      </div>
    </AccountBrowsePage>
  );
}
