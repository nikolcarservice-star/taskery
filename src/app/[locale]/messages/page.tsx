import { loadMessagesPageData } from "@/lib/messages-page-data";
import { MessagesInbox, type ConversationRow } from "@/components/MessagesInbox";
import { PageBackNav } from "@/components/PageBackNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { requireAuth } from "@/lib/session";

type MessagesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MessagesPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.pages.messages.title,
    description: dict.pages.messages.intro,
    path: "/messages",
    locale,
    noIndex: true,
  });
}

export default async function MessagesPage({ params }: MessagesPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const session = await requireAuth(localizedPath(locale, "/messages"));
  const rows: ConversationRow[] = await loadMessagesPageData(session.user.id);

  const content = (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{dict.pages.messages.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{dict.pages.messages.intro}</p>
      <MessagesInbox conversations={rows} />
    </div>
  );

  if (
    session.user.role === "FREELANCER" ||
    session.user.role === "CLIENT" ||
    session.user.role === "ADMIN"
  ) {
    return content;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <SiteHeader locale={locale} dict={dict} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <PageBackNav />
        {content}
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
