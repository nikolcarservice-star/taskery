import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { redirect } from "next/navigation";

export default function AdminMobileCmsRedirect() {
  redirect(`${ADMIN_MOBILE_ROOT}/platform?section=cms`);
}
