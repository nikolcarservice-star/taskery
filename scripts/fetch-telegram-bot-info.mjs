#!/usr/bin/env node
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function getMe(label, token) {
  if (!token?.trim()) {
    console.log(`${label}: token not set`);
    return null;
  }
  const response = await fetch(`https://api.telegram.org/bot${token.trim()}/getMe`);
  const data = await response.json();
  if (!data.ok) {
    console.error(`${label}: ${data.description ?? "getMe failed"}`);
    return null;
  }
  console.log(`${label}: @${data.result.username}`);
  return data.result.username;
}

const user = await getMe("User bot", process.env.TELEGRAM_BOT_TOKEN);
const admin = await getMe("Admin bot", process.env.TELEGRAM_ADMIN_BOT_TOKEN);

if (user) process.stdout.write(`TELEGRAM_BOT_USERNAME=${user}\n`);
if (admin) process.stdout.write(`TELEGRAM_ADMIN_BOT_USERNAME=${admin}\n`);
