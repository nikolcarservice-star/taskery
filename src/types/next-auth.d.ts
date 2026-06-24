import { Role } from "@/generated/prisma/client";
import "next-auth";

declare module "next-auth" {
  interface User {
    role?: Role;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: Role;
      interfaceLanguage?: string;
      isBanned?: boolean;
      sessionInvalid?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    interfaceLanguage?: string;
    isBanned?: boolean;
    sessionVersion?: number;
    sessionInvalid?: boolean;
  }
}
