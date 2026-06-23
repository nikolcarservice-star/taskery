import { Role } from "@/generated/prisma/client";
import { authConfig } from "@/lib/auth.config";
import { getRegistrationBoostFields } from "@/lib/taskboost-promotion.shared";
import { prisma } from "@/lib/prisma";
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
}) {
  const dbUser = token.id
    ? await prisma.user.findUnique({ where: { id: token.id } })
    : token.email
      ? await prisma.user.findUnique({ where: { email: token.email } })
      : null;

  if (!dbUser) return token;

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
  return token;
}

async function authorizeWithPassword(
  email: string | undefined,
  password: string | undefined,
  options?: { adminOnly?: boolean },
) {
  if (!email || !password) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user?.passwordHash) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  if (options?.adminOnly) {
    if (user.role !== "ADMIN") return null;
    if (!user.adminActive) return null;
  } else if (user.role === "ADMIN") {
    return null;
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
      },
      async authorize(credentials) {
        return authorizeWithPassword(
          credentials?.email as string | undefined,
          credentials?.password as string | undefined,
        );
      },
    }),
    Credentials({
      id: "admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return authorizeWithPassword(
          credentials?.email as string | undefined,
          credentials?.password as string | undefined,
          { adminOnly: true },
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
        !token.interfaceLanguage;

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
