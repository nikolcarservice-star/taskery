import { AdminChatReviewThread } from "@/components/admin/AdminChatReviewThread";
import { AdminReviewShell } from "@/components/admin/AdminReviewShell";
import { loadAdminBidReview, resolveAdminReviewBackHref } from "@/lib/admin-review";
import { notFound } from "next/navigation";

type AdminBidReviewPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ back?: string }>;
};

export default async function AdminBidReviewPage({
  params,
  searchParams,
}: AdminBidReviewPageProps) {
  const { id } = await params;
  const { back } = await searchParams;
  const bid = await loadAdminBidReview(id);

  if (!bid) notFound();

  const backHref = resolveAdminReviewBackHref(back);
  const client = bid.project.client;
  const clientName = client.name ?? "Заказчик";
  const freelancerName = bid.freelancer.name ?? "Исполнитель";

  return (
    <AdminReviewShell
      title="Переписка по отклику"
      subtitle={`${bid.project.title} · ${clientName} ↔ ${freelancerName}`}
      backHref={backHref}
    >
      <AdminChatReviewThread
        messages={bid.messages}
        participants={{
          client,
          freelancer: bid.freelancer,
        }}
      />
    </AdminReviewShell>
  );
}
