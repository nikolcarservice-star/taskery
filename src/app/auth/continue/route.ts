import { auth } from "@/lib/auth";
import { defaultLocale, isAppLocale, LOCALE_COOKIE } from "@/lib/i18n/config";
import { getLoginPath } from "@/lib/role-redirect";
import { getHomeRouteForRole } from "@/lib/role-redirect";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  const callbackUrl = safeRedirectPath(
    request.nextUrl.searchParams.get("callbackUrl"),
    "",
  );

  if (!session?.user) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale =
      cookieLocale && isAppLocale(cookieLocale) ? cookieLocale : defaultLocale;
    const loginUrl = new URL(getLoginPath(locale), request.url);
    if (callbackUrl) {
      loginUrl.searchParams.set("callbackUrl", callbackUrl);
    }
    return NextResponse.redirect(loginUrl);
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && isAppLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const destination =
    callbackUrl || getHomeRouteForRole(session.user.role, locale);

  return NextResponse.redirect(new URL(destination, request.url));
}
