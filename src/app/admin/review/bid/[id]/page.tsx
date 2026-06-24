import { AdminChatReviewPanel } from "@/components/admin/AdminChatReviewPanel";
import { AdminReviewShell } from "@/components/admin/AdminReviewShell";
import { auth } from "@/lib/auth";
import { loadAdminBidReview, resolveAdminReviewBackHref } from "@/lib/admin-review";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

type AdminBidReviewPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ back?: string }>;
};

export default async function AdminBidReviewPage({
  params,
  searchParams,
}: AdminBidReviewPageProps) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/admin/overview");
  }

  const { id } = await params;
  const { back } = await searchParams;
  const bid = await loadAdminBidReview(id);

  if (!bid) notFound();

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, avatar: true },
  });

  if (!admin) notFound();

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
      <AdminChatReviewPanel
        mode="bid"
        targetId={bid.id}
        messages={bid.messages}
        admin={admin}
        participants={{
          client,
          freelancer: bid.freelancer,
        }}
      />
    </AdminReviewShell>
  );
}
