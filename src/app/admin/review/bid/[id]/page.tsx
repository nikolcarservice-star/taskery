import { AdminChatReviewPanel } from "@/components/admin/AdminChatReviewPanel";
import { AdminReviewShell } from "@/components/admin/AdminReviewShell";
import { auth } from "@/lib/auth";
import { loadAdminBidReview, resolveAdminReviewBackHref } from "@/lib/admin-review";
import { getAdminCopy } from "@/lib/admin-i18n";
import { getLocale } from "@/lib/i18n/server";
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

  const locale = await getLocale();
  const copy = getAdminCopy(locale);
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
  const clientName = client.name ?? copy.review.clientFallback;
  const freelancerName = bid.freelancer.name ?? copy.review.freelancerFallback;

  return (
    <AdminReviewShell
      locale={locale}
      title={copy.review.bidChatTitle}
      subtitle={`${bid.project.title} · ${clientName} ↔ ${freelancerName}`}
      backHref={backHref}
    >
      <AdminChatReviewPanel
        mode="bid"
        targetId={bid.id}
        messages={bid.messages}
        admin={admin}
        locale={locale}
        participants={{
          client,
          freelancer: bid.freelancer,
        }}
      />
    </AdminReviewShell>
  );
}
