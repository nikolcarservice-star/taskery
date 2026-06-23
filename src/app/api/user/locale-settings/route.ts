import { auth } from "@/lib/auth";
import { isAppLocale, LOCALE_COOKIE } from "@/lib/i18n/config";
import type { AppLocale } from "@/lib/i18n/types";
import { updateUserLocalePreferences } from "@/lib/i18n/user-locale";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

type LocaleSettingsBody = {
  interfaceLanguage?: string;
  autoTranslate?: boolean;
};

export async function PATCH(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = checkRateLimit(`locale-settings:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return rateLimitResponse(limited.retryAfterSec);
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: LocaleSettingsBody;
  try {
    body = (await request.json()) as LocaleSettingsBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { interfaceLanguage, autoTranslate } = body;

  if (interfaceLanguage === undefined && autoTranslate === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  if (
    interfaceLanguage !== undefined &&
    !isAppLocale(interfaceLanguage)
  ) {
    return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
  }

  if (autoTranslate !== undefined && typeof autoTranslate !== "boolean") {
    return NextResponse.json({ error: "Invalid autoTranslate" }, { status: 400 });
  }

  await updateUserLocalePreferences(session.user.id, {
    ...(interfaceLanguage !== undefined
      ? { interfaceLanguage: interfaceLanguage as AppLocale }
      : {}),
    ...(autoTranslate !== undefined ? { autoTranslate } : {}),
  });

  const response = NextResponse.json({
    success: true,
    interfaceLanguage,
    autoTranslate,
  });

  if (interfaceLanguage && isAppLocale(interfaceLanguage)) {
    response.cookies.set(LOCALE_COOKIE, interfaceLanguage, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}
