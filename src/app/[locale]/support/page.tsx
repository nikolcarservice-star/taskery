import { AccountBrowsePage } from "@/components/account/AccountBrowsePage";
import { CreateSupportTicketForm } from "@/components/CreateSupportTicketForm";
import { PageBackNav } from "@/components/PageBackNav";
import { auth } from "@/lib/auth";
import { getLocaleConfig } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { getUserSupportTickets } from "@/lib/queries/admin-support";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";
import { redirect } from "next/navigation";

type SupportPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SupportPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  return createMetadata({
    title: dict.support.meta.listTitle,
    description: dict.support.meta.listDescription,
    path: "/support",
    locale,
  });
}

export default async function SupportPage({ params }: SupportPageProps) {
  const locale = await requireAppLocale(params);
  const session = await auth();
  if (!session?.user?.id) {
    redirect(localizedPath(locale, "/login?callbackUrl=/support"));
  }

  const dict = await getDictionary(locale);
  const tickets = await getUserSupportTickets(session.user.id);
  const intlLocale = getLocaleConfig(locale).intlLocale;
  const t = dict.support;

  return (
    <AccountBrowsePage
      locale={locale}
      dict={dict}
      callbackUrl="/support"
      marketingMainClassName="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:py-12"
    >
      <>
        <PageBackNav className="mb-4 lg:hidden" />
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">{t.h1}</h1>
        <p className="mt-2 text-sm text-zinc-600">{t.intro}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-semibold text-zinc-900">{t.newTicketTitle}</h2>
            <div className="mt-4">
              <CreateSupportTicketForm />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-semibold text-zinc-900">
              {t.myTicketsTitle.replace("{count}", String(tickets.length))}
            </h2>
            {tickets.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-600">{t.emptyTickets}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {tickets.map((ticket) => (
                  <li key={ticket.id}>
                    <Link
                      href={localizedPath(locale, `/support/${ticket.id}`)}
                      className="block rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-zinc-700">
                          {t.status[ticket.status as keyof typeof t.status] ??
                            ticket.status}
                        </span>
                        <span className="text-zinc-500">
                          {new Date(ticket.updatedAt).toLocaleDateString(intlLocale)}
                        </span>
                      </div>
                      <p className="mt-2 font-medium text-zinc-900">
                        {ticket.subject}
                      </p>
                      {ticket.messages[0] && (
                        <p className="mt-1 line-clamp-2 text-xs text-zinc-600">
                          {ticket.messages[0].content}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </>
    </AccountBrowsePage>
  );
}
