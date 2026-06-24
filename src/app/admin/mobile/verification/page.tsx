import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { redirect } from "next/navigation";

export default function AdminMobileVerificationRedirect() {
  redirect(`${ADMIN_MOBILE_ROOT}/users?section=verification`);
}
