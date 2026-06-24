#!/usr/bin/env node
/**
 * Quick production env smoke check. Run before deploy:
 *   node scripts/prod-check.mjs
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const required = [
  ["DATABASE_URL", "PostgreSQL connection"],
  ["AUTH_SECRET", "NextAuth secret (or set NEXTAUTH_SECRET)"],
  ["NEXT_PUBLIC_SITE_URL", "Public site URL"],
];

const recommended = [
  ["RESEND_API_KEY", "Transactional email"],
  ["EMAIL_FROM", "Email sender address"],
  ["BLOB_READ_WRITE_TOKEN", "Avatar/portfolio uploads on Vercel"],
  ["STRIPE_SECRET_KEY", "Payments & escrow"],
  ["STRIPE_WEBHOOK_SECRET", "Stripe webhooks"],
  ["VAPID_PUBLIC_KEY", "Browser push notifications"],
  ["VAPID_PRIVATE_KEY", "Browser push notifications"],
  ["TELEGRAM_BOT_TOKEN", "Telegram bot"],
  ["TELEGRAM_BOT_USERNAME", "Telegram bot username"],
];

function isSet(name) {
  const value = process.env[name]?.trim();
  if (value) return true;
  if (name === "AUTH_SECRET" && process.env.NEXTAUTH_SECRET?.trim()) return true;
  return false;
}

let failed = false;

console.log("Taskery production env check\n");

for (const [name, hint] of required) {
  if (isSet(name)) {
    console.log(`✓ ${name}`);
  } else {
    console.error(`✗ ${name} — required (${hint})`);
    failed = true;
  }
}

console.log("\nRecommended (optional but needed for full MVP):");

for (const [name, hint] of recommended) {
  console.log(`${isSet(name) ? "✓" : "○"} ${name} — ${hint}`);
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
if (siteUrl?.endsWith("/")) {
  console.error("\n✗ NEXT_PUBLIC_SITE_URL should not have a trailing slash");
  failed = true;
}

if (failed) {
  console.error("\nFix required variables before production deploy.");
  process.exit(1);
}

console.log("\nRequired variables look good. Run `npx prisma db push` after schema changes.");
