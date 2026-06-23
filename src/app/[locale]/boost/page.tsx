import { AccountBrowsePage } from "@/components/account/AccountBrowsePage";
import { TaskBoostLanding } from "@/components/TaskBoostLanding";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { createMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { isProUser } from "@/lib/slug";
import { taskBoostPurchaseEnabled } from "@/lib/taskboost-promotion";
import { stripeEnabled } from "@/lib/stripe-config";

type BoostPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BoostPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  return createMetadata({
    title: dict.boost.title,
    description: dict.market.audienceLabel,
    path: "/boost",
    locale,
  });
}

export default async function LocalizedBoostPage({ params }: BoostPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const session = await auth();
  let isPro = false;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionPlan: true, featuredUntil: true },
    });
    isPro = user
      ? isProUser(user.subscriptionPlan, user.featuredUntil)
      : false;
  }

  return (
    <AccountBrowsePage locale={locale} dict={dict} callbackUrl="/boost">
      <TaskBoostLanding
        isPro={isPro}
        userRole={session?.user?.role}
        stripeEnabled={stripeEnabled && taskBoostPurchaseEnabled}
        compact={Boolean(session?.user)}
      />
    </AccountBrowsePage>
  );
}
