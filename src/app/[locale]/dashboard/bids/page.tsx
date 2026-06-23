import { MyBidsTable, type MyBidRow } from "@/components/MyBidsTable";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { requireFreelancer } from "@/lib/session";

type BidsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BidsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.bids;

  return createMetadata({
    title: p.title,
    description: p.intro,
    path: "/dashboard/bids",
    locale,
    noIndex: true,
  });
}

export default async function MyBidsPage({ params }: BidsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.bids;
  const session = await requireFreelancer(localizedPath(locale, "/dashboard/bids"));

  const bids = await prisma.bid.findMany({
    where: { freelancerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        select: {
          slug: true,
          title: true,
          status: true,
          budget: true,
          currency: true,
          deadline: true,
        },
      },
    },
  });

  const rows: MyBidRow[] = bids.map((bid) => ({
    id: bid.id,
    cost: bid.cost.toString(),
    timeframe: bid.timeframe,
    status: bid.status,
    createdAt: bid.createdAt.toISOString(),
    project: {
      slug: bid.project.slug,
      title: bid.project.title,
      status: bid.project.status,
      budget: bid.project.budget?.toString() ?? null,
      currency: bid.project.currency,
      deadline: bid.project.deadline?.toISOString() ?? null,
    },
  }));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{p.intro}</p>

      <MyBidsTable bids={rows} />
    </div>
  );
}
