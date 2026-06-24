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
      if (token.sessionInvalid) {
        return { ...session, expires: "1970-01-01T00:00:00.000Z" };
      }
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role | undefined;
        session.user.interfaceLanguage = token.interfaceLanguage as string | undefined;
        if (!session.user.email && token.email) {
          session.user.email = token.email as string;
        }
        session.user.isBanned = Boolean(token.isBanned);
        session.user.sessionInvalid = Boolean(token.sessionInvalid);
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
