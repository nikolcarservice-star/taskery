import type { AppLocale } from "@/lib/i18n/types";

/**
 * Stub for DeepL / Google Translate integration.
 * Replace the body with a real API call when keys are configured.
 */
export async function translateText(
  text: string,
  from: AppLocale | string,
  to: AppLocale | string,
): Promise<string> {
  if (!text.trim() || from === to) {
    return text;
  }

  // Placeholder: prefix shows translation is simulated until API is wired.
  return `[${to}] ${text}`;
}

export function detectTextLanguage(_text: string): AppLocale {
  return "ru";
}
