import type { Role } from "@/generated/prisma/client";
import { getAuthSecret } from "@/lib/auth-secret";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: getAuthSecret(),
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role as Role | undefined;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role | undefined;
        session.user.interfaceLanguage = token.interfaceLanguage as string | undefined;
        if (!session.user.email && token.email) {
          session.user.email = token.email as string;
        }
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
