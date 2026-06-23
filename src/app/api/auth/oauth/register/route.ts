import { getHomeRouteForRole } from "@/lib/role-redirect";
import { Role } from "@/generated/prisma/client";
import { googleEnabled } from "@/lib/auth";import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const validRoles: Role[] = ["FREELANCER", "CLIENT"];

export async function GET(request: Request) {
  if (!googleEnabled) {
    return NextResponse.json(
      { error: "Google OAuth не настроен" },
      { status: 503 },
    );
  }

  const role = new URL(request.url).searchParams.get("role");

  if (!role || !validRoles.includes(role as Role)) {
    return NextResponse.redirect(
      new URL("/register?error=invalid_role", request.url),
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("oauth_register_role", role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  });

  return NextResponse.redirect(
    new URL(
      `/api/auth/signin/google?callbackUrl=${encodeURIComponent(getHomeRouteForRole(role as Role))}`,
      request.url,
    ),
  );
}
