import { canAccessAdminReview } from "@/lib/admin-review";
import { getAdminPageContext } from "@/lib/admin-page-context";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { redirect } from "next/navigation";

type AdminReviewLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminReviewLayout({
  children,
}: AdminReviewLayoutProps) {
  const { permissions } = await getAdminPageContext(ADMIN_MOBILE_ROOT);

  if (!canAccessAdminReview(permissions)) {
    redirect(ADMIN_MOBILE_ROOT);
  }

  return (
    <div className="min-h-dvh bg-zinc-100 px-4 py-4 sm:py-6">{children}</div>
  );
}
