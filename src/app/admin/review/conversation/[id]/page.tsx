import { AdminChatReviewThread } from "@/components/admin/AdminChatReviewThread";
import { AdminReviewShell } from "@/components/admin/AdminReviewShell";
import {
  loadAdminConversationReview,
  resolveAdminReviewBackHref,
} from "@/lib/admin-review";
import { notFound } from "next/navigation";

type AdminConversationReviewPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ back?: string }>;
};

export default async function AdminConversationReviewPage({
  params,
  searchParams,
}: AdminConversationReviewPageProps) {
  const { id } = await params;
  const { back } = await searchParams;
  const conversation = await loadAdminConversationReview(id);

  if (!conversation) notFound();

  const backHref = resolveAdminReviewBackHref(back);
  const clientName = conversation.client.name ?? "Заказчик";
  const freelancerName = conversation.freelancer.name ?? "Исполнитель";

  return (
    <AdminReviewShell
      title="Чат проекта"
      subtitle={`${conversation.project.title} · ${clientName} ↔ ${freelancerName}`}
      backHref={backHref}
    >
      <AdminChatReviewThread
        messages={conversation.messages}
        participants={{
          client: conversation.client,
          freelancer: conversation.freelancer,
        }}
      />
    </AdminReviewShell>
  );
}
