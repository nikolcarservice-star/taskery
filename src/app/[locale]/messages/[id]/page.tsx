import { ConversationHeader } from "@/components/ConversationHeader";
import { EscrowFundingNotice } from "@/components/EscrowFundingNotice";
import { MessageThread } from "@/components/MessageThread";
import { PageBackNav } from "@/components/PageBackNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { markConversationMessagesRead } from "@/lib/messages-inbox";
import { createMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { stripeEnabled } from "@/lib/stripe-config";
import { notFound } from "next/navigation";

type ConversationPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: ConversationPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.inbox.conversationPageTitle,
    description: dict.inbox.conversationPageDescription,
    path: "/messages",
    locale,
    noIndex: true,
  });
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const { id } = await params;
  const messagesPath = localizedPath(locale, "/messages");
  const session = await requireAuth(messagesPath);
  const isFreelancer = session.user.role === "FREELANCER";

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          slug: true,
          currency: true,
          status: true,
          contract: {
            select: {
              status: true,
              amount: true,
            },
          },
        },
      },
      client: { select: { id: true, name: true, avatar: true, balance: true } },
      freelancer: { select: { id: true, name: true, avatar: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
        },
      },
      _count: { select: { messages: true } },
    },
  });

  if (!conversation) notFound();

  const isParticipant =
    conversation.clientId === session.user.id ||
    conversation.freelancerId === session.user.id ||
    session.user.role === "ADMIN";

  if (!isParticipant) notFound();

  await markConversationMessagesRead(session.user.id, conversation.id);

  const isClient = conversation.clientId === session.user.id;
  const partner = isClient ? conversation.freelancer : conversation.client;
  const contract = conversation.project.contract;

  const content = (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <ConversationHeader
        conversationId={conversation.id}
        projectTitle={conversation.project.title}
        projectSlug={conversation.project.slug}
        partnerName={partner.name}
        partnerAvatar={partner.avatar}
        messageCount={conversation._count.messages}
      />

      {contract && (
        <EscrowFundingNotice
          contractStatus={contract.status}
          projectStatus={conversation.project.status}
          amount={Number(contract.amount)}
          currency={conversation.project.currency}
          isClient={isClient}
          projectId={conversation.project.id}
          clientBalance={Number(conversation.client.balance)}
          stripeEnabled={stripeEnabled}
        />
      )}

      <MessageThread
        conversationId={conversation.id}
        messages={conversation.messages}
        currentUserId={session.user.id}
        partner={{
          name: partner.name,
          avatar: partner.avatar,
        }}
      />
    </div>
  );

  if (isFreelancer || session.user.role === "CLIENT") {
    return content;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <SiteHeader locale={locale} dict={dict} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <PageBackNav />
        {content}
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
