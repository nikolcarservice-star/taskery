import { ExternalLeaveView } from "@/components/ExternalLeaveView";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  EXTERNAL_LEAVE_COOKIE,
  normalizeExternalUrl,
} from "@/lib/external-links";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { createMetadata } from "@/lib/metadata";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

type LeavePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ to?: string }>;
};

export async function generateMetadata({ params }: LeavePageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.externalLeave.metaTitle,
    description: dict.externalLeave.metaDescription,
    path: "/leave",
    locale,
    noIndex: true,
  });
}

export default async function LeavePage({ params, searchParams }: LeavePageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const { to } = await searchParams;
  const targetUrl = normalizeExternalUrl(to ?? "");

  if (!targetUrl) {
    notFound();
  }

  const cookieStore = await cookies();
  if (cookieStore.get(EXTERNAL_LEAVE_COOKIE)?.value === "1") {
    redirect(targetUrl);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gradient-to-b from-indigo-50 via-white to-zinc-50">
      <SiteHeader locale={locale} dict={dict} />

      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-6 py-12 sm:py-16">
        <ExternalLeaveView targetUrl={targetUrl} />
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
