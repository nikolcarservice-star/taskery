export const ADMIN_REVIEW_ROOT = "/admin/review";

export function adminConversationReviewPath(
  conversationId: string,
  backHref?: string,
): string {
  const path = `${ADMIN_REVIEW_ROOT}/conversation/${conversationId}`;
  if (!backHref) return path;
  return `${path}?back=${encodeURIComponent(backHref)}`;
}

export function adminBidReviewPath(bidId: string, backHref?: string): string {
  const path = `${ADMIN_REVIEW_ROOT}/bid/${bidId}`;
  if (!backHref) return path;
  return `${path}?back=${encodeURIComponent(backHref)}`;
}

export function resolveAdminReviewBackHref(back?: string): string {
  if (back && back.startsWith("/admin")) {
    return back;
  }
  return "/admin/moderation";
}
