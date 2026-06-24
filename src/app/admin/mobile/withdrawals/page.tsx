import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import { redirect } from "next/navigation";

export default function AdminMobileWithdrawalsRedirect() {
  redirect(`${ADMIN_MOBILE_ROOT}/finance?section=withdrawals`);
}
