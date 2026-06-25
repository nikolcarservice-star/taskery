import { NextRequest, NextResponse } from "next/server";

export function verifyTelegramWebhookSecret(
  request: NextRequest,
  envVarName: "TELEGRAM_WEBHOOK_SECRET" | "TELEGRAM_ADMIN_WEBHOOK_SECRET",
) {
  const secret = process.env[envVarName]?.trim();
  if (!secret) return true;
  const header = request.headers.get("x-telegram-bot-api-secret-token");
  return header === secret;
}
