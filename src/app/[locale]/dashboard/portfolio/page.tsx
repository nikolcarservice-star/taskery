import { MyPortfolio, type PortfolioItemRow } from "@/components/MyPortfolio";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { requireFreelancer } from "@/lib/session";

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PortfolioPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.portfolio;

  return createMetadata({
    title: p.title,
    description: p.intro,
    path: "/dashboard/portfolio",
    locale,
    noIndex: true,
  });
}

export default async function MyPortfolioPage({ params }: PortfolioPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.portfolio;
  const session = await requireFreelancer(localizedPath(locale, "/dashboard/portfolio"));

  const profile = await prisma.freelancerProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
    include: {
      portfolioItems: { orderBy: { createdAt: "desc" } },
    },
  });

  const items: PortfolioItemRow[] = profile.portfolioItems.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    projectUrl: item.projectUrl,
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{p.intro}</p>

      <MyPortfolio items={items} userId={session.user.id} />
    </div>
  );
}
