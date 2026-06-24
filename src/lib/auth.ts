import { Role } from "@/generated/prisma/client";
import { isUserCurrentlyBanned, clearExpiredTemporaryBan } from "@/lib/user-ban";
import { authConfig } from "@/lib/auth.config";
import { getRegistrationBoostFields } from "@/lib/taskboost-promotion.shared";
import { prisma } from "@/lib/prisma";
import { verifyTotpCode } from "@/lib/totp";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { cookies } from "next/headers";
import { cache } from "react";

const googleEnabled =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

async function loadUserIntoToken(token: {
  id?: string;
  email?: string | null;
  role?: Role;
  interfaceLanguage?: string;
  isBanned?: boolean;
  sessionVersion?: number;
  sessionInvalid?: boolean;
}) {
  const dbUser = token.id
    ? await prisma.user.findUnique({ where: { id: token.id } })
    : token.email
      ? await prisma.user.findUnique({ where: { email: token.email } })
      : null;

  if (!dbUser) {
    token.sessionInvalid = true;
    return token;
  }

  if (
    token.sessionVersion !== undefined &&
    token.sessionVersion !== dbUser.sessionVersion
  ) {
    token.sessionInvalid = true;
    return token;
  }

  await clearExpiredTemporaryBan(dbUser.id);

  const refreshedUser =
    dbUser.bannedUntil && dbUser.bannedUntil <= new Date()
      ? await prisma.user.findUnique({ where: { id: dbUser.id } })
      : dbUser;

  const activeUser = refreshedUser ?? dbUser;

  if (isUserCurrentlyBanned(activeUser)) {
    if (activeUser.role !== "ADMIN") {
      token.isBanned = true;
      return token;
    }
  } else {
    token.isBanned = false;
  }

  if (
    dbUser.subscriptionPlan === "PRO" &&
    dbUser.featuredUntil &&
    dbUser.featuredUntil <= new Date()
  ) {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { subscriptionPlan: "FREE" },
    });
    dbUser.subscriptionPlan = "FREE";
  }

  token.id = dbUser.id;
  token.email = dbUser.email;
  token.role = dbUser.role;
  token.interfaceLanguage = dbUser.interfaceLanguage;
  token.sessionVersion = dbUser.sessionVersion;
  token.sessionInvalid = false;
  return token;
}

async function authorizeWithPassword(
  email: string | undefined,
  password: string | undefined,
  options?: { adminOnly?: boolean; totpCode?: string },
) {
  if (!email || !password) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user?.passwordHash) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  if (!options?.adminOnly && (user.bannedAt || user.deletedAt)) {
    return null;
  }

  if (options?.adminOnly) {
    if (user.role !== "ADMIN") return null;
    if (!user.adminActive) return null;
  } else if (user.role === "ADMIN") {
    return null;
  }

  if (user.twoFactorEnabled && user.twoFactorSecret) {
    const code = options?.totpCode?.trim() ?? "";
    if (!code || !verifyTotpCode(user.twoFactorSecret, code)) {
      return null;
    }
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export const { handlers, signIn, signOut, auth: getAuthSession } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        return authorizeWithPassword(
          credentials?.email as string | undefined,
          credentials?.password as string | undefined,
          { totpCode: credentials?.totpCode as string | undefined },
        );
      },
    }),
    Credentials({
      id: "admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        return authorizeWithPassword(
          credentials?.email as string | undefined,
          credentials?.password as string | undefined,
          { adminOnly: true, totpCode: credentials?.totpCode as string | undefined },
        );
      },
    }),
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return true;
      }

      const existing = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existing) {
        if (existing.bannedAt || existing.deletedAt) {
          return "/login?error=banned";
        }
        if (!existing.avatar && user.image) {
          await prisma.user.update({
            where: { id: existing.id },
            data: { avatar: user.image },
          });
        }
        return true;
      }

      const cookieStore = await cookies();
      const role = cookieStore.get("oauth_register_role")?.value;

      if (!role || !["FREELANCER", "CLIENT"].includes(role)) {
        return "/register?error=oauth_role_required";
      }

      await prisma.user.create({
        data: {
          email: user.email,
          name: user.name ?? null,
          avatar: user.image ?? null,
          role: role as Role,
          ...(role === "FREELANCER"
            ? {
                freelancerProfile: { create: {} },
                ...getRegistrationBoostFields(),
              }
            : {}),
        },
      });

      cookieStore.delete("oauth_register_role");
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role as Role | undefined;
      }

      const shouldSyncFromDb =
        Boolean(user) ||
        trigger === "update" ||
        !token.role ||
        !token.interfaceLanguage ||
        token.sessionVersion === undefined;

      if (shouldSyncFromDb && (token.id || token.email)) {
        return loadUserIntoToken(token);
      }

      return token;
    },
  },
});

/** Dedupe session reads within a single RSC render pass. */
export const auth = cache(getAuthSession);

export { googleEnabled };
