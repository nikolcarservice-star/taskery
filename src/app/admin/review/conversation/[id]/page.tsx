import { AdminChatReviewPanel } from "@/components/admin/AdminChatReviewPanel";
import { AdminReviewShell } from "@/components/admin/AdminReviewShell";
import { auth } from "@/lib/auth";
import {
  loadAdminConversationReview,
  resolveAdminReviewBackHref,
} from "@/lib/admin-review";
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
  const clientName = conversation.client.name ?? "Заказчик";
  const freelancerName = conversation.freelancer.name ?? "Исполнитель";

  return (
    <AdminReviewShell
      title="Чат проекта"
      subtitle={`${conversation.project.title} · ${clientName} ↔ ${freelancerName}`}
      backHref={backHref}
    >
      <AdminChatReviewPanel
        mode="conversation"
        targetId={conversation.id}
        messages={conversation.messages}
        admin={admin}
        participants={{
          client: conversation.client,
          freelancer: conversation.freelancer,
        }}
      />
    </AdminReviewShell>
  );
}
