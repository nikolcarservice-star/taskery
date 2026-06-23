const AUTH_GUEST_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function isAccountCabinetPath(path: string): boolean {
  return (
    path === "/client" ||
    path.startsWith("/client/") ||
    path === "/dashboard" ||
    path.startsWith("/dashboard/") ||
    path === "/messages" ||
    path.startsWith("/messages/") ||
    path === "/notifications" ||
    path === "/boost" ||
    path.startsWith("/boost/")
  );
}

export function isAccountMobileAppPath(path: string): boolean {
  if (path === "/admin" || path.startsWith("/admin/") || path.startsWith("/cabinet")) {
    return false;
  }

  if (AUTH_GUEST_PATHS.some((segment) => path === segment || path.startsWith(`${segment}/`))) {
    return false;
  }

  return true;
}

export function shouldHideSiteFooterForUser(
  path: string,
  role?: string | null,
): boolean {
  if (!role || !isAccountMobileAppPath(path)) {
    return false;
  }

  return role === "CLIENT" || role === "FREELANCER" || role === "ADMIN";
}

export function isProfileAreaPath(path: string, role: "client" | "freelancer"): boolean {
  const clientPaths = [
    "/client/finances",
    "/client/reviews",
    "/client/personal",
    "/client/settings",
    "/client/projects/new",
    "/freelancers",
    "/contact",
    "/faq",
    "/notifications",
    "/billing",
    "/cabinet",
    "/admin",
    "/admin/mobile",
  ];

  const freelancerPaths = [
    "/dashboard/finances",
    "/dashboard/portfolio",
    "/dashboard/reviews",
    "/dashboard/personal",
    "/dashboard/profile",
    "/dashboard/settings",
    "/boost",
    "/projects",
    "/contact",
    "/faq",
    "/notifications",
    "/billing",
    "/cabinet",
    "/admin",
    "/admin/mobile",
  ];

  const prefixes = role === "client" ? clientPaths : freelancerPaths;

  return prefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}
