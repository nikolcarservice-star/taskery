import { BackLink } from "@/components/BackLink";
import { AccountBrowsePage } from "@/components/account/AccountBrowsePage";
import { PageBackNav } from "@/components/PageBackNav";
import { SupportTicketThread } from "@/components/SupportTicketThread";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { loadSupportTicketDetail } from "@/lib/queries/admin-support";
import { createMetadata } from "@/lib/metadata";
import { notFound, redirect } from "next/navigation";

type SupportTicketPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: SupportTicketPageProps) {
  const locale = await requireAppLocale(params);
  return createMetadata({
    title: "Обращение в поддержку",
    description: "Переписка со службой поддержки Taskery",
    path: "/support",
    locale,
  });
}

export default async function SupportTicketPage({ params }: SupportTicketPageProps) {
  const locale = await requireAppLocale(params);
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(localizedPath(locale, `/login?callbackUrl=/support/${id}`));
  }

  const ticket = await loadSupportTicketDetail(id);
  if (!ticket) notFound();

  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && ticket.userId !== session.user.id) notFound();

  const dict = await getDictionary(locale);

  return (
    <AccountBrowsePage
      locale={locale}
      dict={dict}
      callbackUrl={`/support/${id}`}
      marketingMainClassName="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:py-12"
    >
      <>
        <BackLink
          href={localizedPath(locale, isAdmin ? "/admin/mobile/support" : "/support")}
          label={isAdmin ? "Поддержка" : "Мои обращения"}
          className="mb-4 lg:hidden"
        />
        <h1 className="text-2xl font-bold text-zinc-900">{ticket.subject}</h1>
        <p className="mt-2 text-sm text-zinc-600">
          {ticket.user.name ?? ticket.user.email}
          {" · "}
          {new Date(ticket.createdAt).toLocaleString("ru-RU")}
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <SupportTicketThread
            ticketId={ticket.id}
            messages={ticket.messages.map((message) => ({
              id: message.id,
              content: message.content,
              isStaff: message.isStaff,
              createdAt: message.createdAt.toISOString(),
              sender: {
                name: message.sender.name,
                role: message.sender.role,
              },
            }))}
            closed={ticket.status === "CLOSED"}
          />
        </div>
      </>
    </AccountBrowsePage>
  );
}
