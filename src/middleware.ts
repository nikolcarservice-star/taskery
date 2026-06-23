import {
  ADMIN_WORK_MODE_COOKIE,
  adminWorkModeCookieOptions,
  shouldSetAdminClientMode,
  shouldSetAdminFreelancerMode,
} from "@/lib/admin-work-mode.constants";
import { authConfig } from "@/lib/auth.config";
import {
  APP_LOCALES,
  defaultLocale,
  isAppLocale,
  LOCALE_COOKIE,
} from "@/lib/i18n/config";
import {
  isLegacyLocalizedPath,
  localizedPath,
  parsePathname,
} from "@/lib/i18n/routing";
import { resolveRequestLocale } from "@/lib/i18n/resolve-request-locale";
import type { AppLocale } from "@/lib/i18n/types";
import { getHomeRouteForRole, getLoginPath } from "@/lib/role-redirect";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

function withAdminWorkModeCookie(
  response: NextResponse,
  pathname: string,
  role?: string | null,
) {
  if (role !== "ADMIN") {
    return response;
  }

  if (shouldSetAdminClientMode(pathname)) {
    response.cookies.set(ADMIN_WORK_MODE_COOKIE, "client", adminWorkModeCookieOptions);
  } else if (shouldSetAdminFreelancerMode(pathname)) {
    response.cookies.set(
      ADMIN_WORK_MODE_COOKIE,
      "freelancer",
      adminWorkModeCookieOptions,
    );
  }

  return response;
}

function withLocaleCookie(response: NextResponse, locale: AppLocale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

function withPathnameHeader(response: NextResponse, pathname: string) {
  response.headers.set("x-pathname", pathname);
  return response;
}

function withLocaleHeaders(response: NextResponse, locale: AppLocale) {
  response.headers.set("x-taskery-locale", locale);
  return response;
}

function redirectToLocalized(
  request: { nextUrl: URL; url: string; cookies: { get: (name: string) => { value: string } | undefined } },
  pathname: string,
  locale: AppLocale,
) {
  const url = new URL(localizedPath(locale, pathname), request.url);
  return withLocaleHeaders(
    withLocaleCookie(NextResponse.redirect(url), locale),
    locale,
  );
}

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const preferredLocale = resolveRequestLocale({
    interfaceLanguage: session?.user?.interfaceLanguage,
    cookieLocale,
    acceptLanguage: request.headers.get("accept-language"),
    isAuthenticated: Boolean(session?.user),
  });

  if (pathname.startsWith("/admin/login")) {
    const url = new URL("/admin", request.url);
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl) {
      url.searchParams.set("callbackUrl", callbackUrl);
    }
    return NextResponse.redirect(url);
  }

  if (pathname === "/") {
    const locale = preferredLocale;
    if (session?.user) {
      return withLocaleHeaders(
        withLocaleCookie(
          NextResponse.redirect(new URL(getHomeRouteForRole(session.user.role, locale), request.url)),
          locale,
        ),
        locale,
      );
    }
    return withLocaleHeaders(
      withLocaleCookie(NextResponse.redirect(new URL(`/${locale}`, request.url)), locale),
      locale,
    );
  }

  if (isLegacyLocalizedPath(pathname)) {
    return redirectToLocalized(request, pathname, preferredLocale);
  }

  const { locale, pathnameWithoutLocale } = parsePathname(pathname);
  const activeLocale = locale ?? preferredLocale;

  if (
    session?.user &&
    locale &&
    isAppLocale(locale) &&
    locale !== preferredLocale
  ) {
    return redirectToLocalized(request, pathnameWithoutLocale, preferredLocale);
  }

  if (locale && !isAppLocale(locale)) {
    return withPathnameHeader(NextResponse.next(), pathname);
  }

  const isAdminRoot = pathnameWithoutLocale === "/admin";
  const isAdminCabinet = pathnameWithoutLocale.startsWith("/cabinet");

  const protectedPrefixes = [
    "/cabinet",
    "/dashboard",
    "/client",
    "/profile/edit",
    "/messages",
    "/notifications",
  ];
  const authRoutes = ["/login", "/register"];

  const isProtected = protectedPrefixes.some((prefix) =>
    pathnameWithoutLocale.startsWith(prefix),
  );
  const isAuthRoute = authRoutes.some((prefix) =>
    pathnameWithoutLocale.startsWith(prefix),
  );
  const isLocaleHome =
    pathnameWithoutLocale === "/" && locale && isAppLocale(locale);

  if (isLocaleHome && session?.user) {
    return withLocaleHeaders(
      withLocaleCookie(
        NextResponse.redirect(
          new URL(getHomeRouteForRole(session.user.role, locale), request.url),
        ),
        locale,
      ),
      locale,
    );
  }

  if (isAdminRoot) {
    if (session?.user?.role === "ADMIN" || !session?.user) {
      return withPathnameHeader(
        withLocaleHeaders(
          withAdminWorkModeCookie(NextResponse.next(), pathnameWithoutLocale, session?.user?.role),
          activeLocale,
        ),
        pathname,
      );
    }

    return withLocaleHeaders(
      NextResponse.redirect(
        new URL(getHomeRouteForRole(session.user.role, activeLocale), request.url),
      ),
      activeLocale,
    );
  }

  if (isAdminCabinet) {
    if (session?.user?.role === "ADMIN") {
      return withPathnameHeader(
        withLocaleHeaders(
          withAdminWorkModeCookie(NextResponse.next(), pathnameWithoutLocale, session.user.role),
          activeLocale,
        ),
        pathname,
      );
    }

    if (!session?.user) {
      const adminLoginUrl = new URL("/admin", request.url);
      adminLoginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(adminLoginUrl);
    }

    return withLocaleHeaders(
      NextResponse.redirect(
        new URL(getHomeRouteForRole(session.user.role, activeLocale), request.url),
      ),
      activeLocale,
    );
  }

  if (isProtected && !session?.user) {
    const loginUrl = new URL(
      pathnameWithoutLocale.startsWith("/cabinet") ? "/admin" : getLoginPath(activeLocale),
      request.url,
    );
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session?.user?.isBanned) {
    const loginUrl = new URL(getLoginPath(activeLocale), request.url);
    loginUrl.searchParams.set("error", "banned");
    return withLocaleHeaders(
      NextResponse.redirect(loginUrl),
      activeLocale,
    );
  }

  if (isAuthRoute && session?.user) {
    return withLocaleHeaders(
      withLocaleCookie(
        NextResponse.redirect(
          new URL(getHomeRouteForRole(session.user.role, activeLocale), request.url),
        ),
        activeLocale,
      ),
      activeLocale,
    );
  }

  if (
    session?.user &&
    pathnameWithoutLocale.startsWith("/dashboard") &&
    session.user.role === "CLIENT"
  ) {
    const clientPath = localizedPath(
      activeLocale,
      pathnameWithoutLocale.replace(/^\/dashboard/, "/client"),
    );
    return withLocaleHeaders(
      NextResponse.redirect(new URL(clientPath, request.url)),
      activeLocale,
    );
  }

  if (
    session?.user &&
    pathnameWithoutLocale.startsWith("/client") &&
    session.user.role === "FREELANCER"
  ) {
    const dashboardPath = localizedPath(
      activeLocale,
      pathnameWithoutLocale.replace(/^\/client/, "/dashboard"),
    );
    return withLocaleHeaders(
      NextResponse.redirect(new URL(dashboardPath, request.url)),
      activeLocale,
    );
  }

  const response = withAdminWorkModeCookie(
    NextResponse.next(),
    pathnameWithoutLocale,
    session?.user?.role,
  );

  if (locale && isAppLocale(locale)) {
    withLocaleCookie(response, locale);
  }

  return withPathnameHeader(withLocaleHeaders(response, activeLocale), pathname);
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)",
  ],
};
