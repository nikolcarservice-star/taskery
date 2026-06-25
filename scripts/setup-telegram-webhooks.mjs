#!/usr/bin/env node
/**
 * Register Telegram webhooks for user and admin bots.
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_SITE_URL set (no trailing slash)
 *   - TELEGRAM_BOT_TOKEN + TELEGRAM_WEBHOOK_SECRET (user bot)
 *   - TELEGRAM_ADMIN_BOT_TOKEN + TELEGRAM_ADMIN_WEBHOOK_SECRET (admin bot)
 *
 * Usage:
 *   node scripts/setup-telegram-webhooks.mjs
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

if (!siteUrl) {
  console.error("NEXT_PUBLIC_SITE_URL is required");
  process.exit(1);
}

async function setWebhook(label, token, path, secret) {
  if (!token?.trim()) {
    console.log(`[skip] ${label}: token not set`);
    return;
  }

  const url = `${siteUrl}${path}`;
  const body = new URLSearchParams({ url });
  if (secret?.trim()) {
    body.set("secret_token", secret.trim());
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token.trim()}/setWebhook`,
    { method: "POST", body },
  );
  const data = await response.json();

  if (!data.ok) {
    console.error(`[fail] ${label}:`, data.description ?? data);
    return false;
  }

  console.log(`[ok] ${label} → ${url}`);
  return true;
}

async function setCommands(label, token, commands) {
  if (!token?.trim()) return;

  const response = await fetch(
    `https://api.telegram.org/bot${token.trim()}/setMyCommands`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commands }),
    },
  );
  const data = await response.json();
  if (data.ok) {
    console.log(`[ok] ${label} commands registered`);
  } else {
    console.warn(`[warn] ${label} commands:`, data.description);
  }
}

let ok = true;

ok =
  (await setWebhook(
    "User bot",
    process.env.TELEGRAM_BOT_TOKEN,
    "/api/telegram/webhook",
    process.env.TELEGRAM_WEBHOOK_SECRET,
  )) !== false && ok;

ok =
  (await setWebhook(
    "Admin bot",
    process.env.TELEGRAM_ADMIN_BOT_TOKEN,
    "/api/telegram/admin-webhook",
    process.env.TELEGRAM_ADMIN_WEBHOOK_SECRET,
  )) !== false && ok;

await setCommands("Admin bot", process.env.TELEGRAM_ADMIN_BOT_TOKEN, [
  { command: "menu", description: "Главное меню" },
  { command: "help", description: "Справка по командам" },
  { command: "pending", description: "Проекты на модерации" },
  { command: "reports", description: "Открытые жалобы" },
  { command: "withdrawals", description: "Заявки на вывод" },
]);

if (!ok) process.exit(1);

console.log("\nDone. Connect bots:");
if (process.env.TELEGRAM_BOT_USERNAME) {
  console.log(`  User:  https://t.me/${process.env.TELEGRAM_BOT_USERNAME}`);
}
if (process.env.TELEGRAM_ADMIN_BOT_USERNAME) {
  console.log(
    `  Admin: https://t.me/${process.env.TELEGRAM_ADMIN_BOT_USERNAME} (link only from /admin/overview)`,
  );
}
