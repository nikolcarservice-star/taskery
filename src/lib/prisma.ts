import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaClientVersion?: string;
};

// Bump when Prisma schema/client shape changes to avoid stale dev singleton.
const PRISMA_CLIENT_VERSION = "2026-06-21-admin-permissions";

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Serverless: one connection per function instance (Neon pooler handles concurrency).
    max: process.env.NODE_ENV === "production" ? 1 : 10,
  });

  return new PrismaClient({
    adapter: new PrismaPg(pool),
  });
}

function getPrismaClient() {
  if (
    globalForPrisma.prisma &&
    globalForPrisma.prismaClientVersion === PRISMA_CLIENT_VERSION
  ) {
    return globalForPrisma.prisma;
  }

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
    globalForPrisma.prismaClientVersion = PRISMA_CLIENT_VERSION;
  }

  return client;
}

export const prisma = getPrismaClient();
