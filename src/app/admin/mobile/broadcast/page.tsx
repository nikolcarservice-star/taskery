import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { redirect } from "next/navigation";

export default function AdminMobileBroadcastRedirect() {
  redirect(`${ADMIN_MOBILE_ROOT}/platform?section=broadcast`);
}
