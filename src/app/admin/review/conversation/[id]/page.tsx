import { AdminChatReviewPanel } from "@/components/admin/AdminChatReviewPanel";
import { AdminReviewShell } from "@/components/admin/AdminReviewShell";
import { auth } from "@/lib/auth";
import {
  loadAdminConversationReview,
  resolveAdminReviewBackHref,
} from "@/lib/admin-review";
import { getAdminCopy } from "@/lib/admin-i18n";
import { getLocale } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

type AdminConversationReviewPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ back?: string }>;
};

export default async function AdminConversationReviewPage({
  params,
  searchParams,
}: AdminConversationReviewPageProps) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/admin/overview");
  }

  const locale = await getLocale();
  const copy = getAdminCopy(locale);
  const { id } = await params;
  const { back } = await searchParams;
  const conversation = await loadAdminConversationReview(id);

  if (!conversation) notFound();

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, avatar: true },
  });

  if (!admin) notFound();

  const backHref = resolveAdminReviewBackHref(back);
  const clientName = conversation.client.name ?? copy.review.clientFallback;
  const freelancerName =
    conversation.freelancer.name ?? copy.review.freelancerFallback;

  return (
    <AdminReviewShell
      locale={locale}
      title={copy.review.projectChatTitle}
      subtitle={`${conversation.project.title} · ${clientName} ↔ ${freelancerName}`}
      backHref={backHref}
    >
      <AdminChatReviewPanel
        mode="conversation"
        targetId={conversation.id}
        messages={conversation.messages}
        admin={admin}
        locale={locale}
        participants={{
          client: conversation.client,
          freelancer: conversation.freelancer,
        }}
      />
    </AdminReviewShell>
  );
}
