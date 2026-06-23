import { ClientFinances } from "@/components/ClientFinances";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { getClientFinanceData } from "@/lib/client-finances";
import { requireClient } from "@/lib/session";
import { stripeEnabled } from "@/lib/stripe-config";
import { Suspense } from "react";

type ClientFinancesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ClientFinancesPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.client.finances;

  return createMetadata({
    title: p.title,
    description: p.intro,
    path: "/client/finances",
    locale,
    noIndex: true,
  });
}

function FinancesFallback() {
  return <div className="mt-6 h-40 animate-pulse rounded-xl bg-zinc-100" />;
}

export default async function ClientFinancesPage({ params }: ClientFinancesPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.client.finances;
  const session = await requireClient(localizedPath(locale, "/client/finances"));
  const data = await getClientFinanceData(
    session.user.id,
    locale,
    dict.cabinetForms.finances.ledger,
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{p.intro}</p>

      <Suspense fallback={<FinancesFallback />}>
        <ClientFinances
          summary={data.summary}
          ledger={data.ledger}
          monthlyStats={data.monthlyStats}
          yearTotal={data.yearTotal}
          stripeEnabled={stripeEnabled}
        />
      </Suspense>
    </div>
  );
}
