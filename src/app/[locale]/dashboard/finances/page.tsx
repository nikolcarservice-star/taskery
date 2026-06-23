import { FreelancerFinances } from "@/components/FreelancerFinances";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { getFreelancerFinanceData } from "@/lib/freelancer-finances";
import { requireFreelancer } from "@/lib/session";
import { Suspense } from "react";

type FinancesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: FinancesPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.finances;

  return createMetadata({
    title: p.title,
    description: p.intro,
    path: "/dashboard/finances",
    locale,
    noIndex: true,
  });
}

function FinancesFallback() {
  return (
    <div className="mt-6 h-40 animate-pulse rounded-xl bg-zinc-100" />
  );
}

export default async function FreelancerFinancesPage({ params }: FinancesPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.finances;
  const session = await requireFreelancer(localizedPath(locale, "/dashboard/finances"));
  const data = await getFreelancerFinanceData(
    session.user.id,
    locale,
    dict.cabinetForms.finances.ledger,
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{p.intro}</p>

      <Suspense fallback={<FinancesFallback />}>
        <FreelancerFinances
          summary={data.summary}
          ledger={data.ledger}
          withdrawalLedger={data.withdrawalLedger}
          pendingWithdrawal={data.pendingWithdrawal}
          savedPayout={data.savedPayout}
          monthlyStats={data.monthlyStats}
          yearTotal={data.yearTotal}
        />
      </Suspense>
    </div>
  );
}
