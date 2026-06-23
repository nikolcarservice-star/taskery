export type AdminWorkMode = "client" | "freelancer";

export const ADMIN_WORK_MODE_COOKIE = "admin_work_mode";

export const adminWorkModeCookieOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
};

export function shouldSetAdminClientMode(pathname: string) {
  return pathname.startsWith("/client");
}

export function shouldSetAdminFreelancerMode(pathname: string) {
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/boost")) {
    return true;
  }

  if (pathname === "/projects") {
    return true;
  }

  const projectDetailMatch = pathname.match(/^\/projects\/([^/]+)$/);
  if (!projectDetailMatch) {
    return false;
  }

  return !["new", "my"].includes(projectDetailMatch[1]);
}
