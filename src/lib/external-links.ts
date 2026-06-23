import type { AppLocale } from "@/lib/i18n/types";
import { localizedPath } from "@/lib/i18n/routing";
import { isPlatformHost, normalizeHost } from "@/lib/moderation/message-guard";

export const EXTERNAL_LEAVE_COOKIE = "taskery_leave_trust";
export const EXTERNAL_LEAVE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const URL_TOKEN_PATTERN =
  /(?:https?:\/\/|www\.)[^\s<>"']+|\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|net|org|io|me|co|ua|pl|dev|app|link|xyz|info|biz|ru|uk|edu|cc|gg|tv|pro|online|site|tech|cloud)(?:\/[^\s<>"']*)?\b/gi;

export function normalizeExternalUrl(raw: string): string | null {
  const trimmed = raw.trim().replace(/[),.;!?]+$/g, "");
  if (!trimmed) return null;

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    if (isPlatformHost(normalizeHost(parsed.hostname))) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function buildLeavePath(locale: AppLocale, targetUrl: string): string {
  return `${localizedPath(locale, "/leave")}?to=${encodeURIComponent(targetUrl)}`;
}

export type MessageContentSegment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string; external: boolean };

export function segmentMessageContent(
  content: string,
  locale: AppLocale,
  warnExternalLinks: boolean,
): MessageContentSegment[] {
  const segments: MessageContentSegment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(URL_TOKEN_PATTERN)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      segments.push({ type: "text", value: content.slice(lastIndex, index) });
    }

    const externalUrl = normalizeExternalUrl(token);
    if (externalUrl && warnExternalLinks) {
      segments.push({
        type: "link",
        value: token,
        href: buildLeavePath(locale, externalUrl),
        external: true,
      });
    } else if (externalUrl) {
      segments.push({
        type: "link",
        value: token,
        href: externalUrl,
        external: true,
      });
    } else {
      const platformUrl = normalizePlatformUrl(token);
      if (platformUrl) {
        segments.push({
          type: "link",
          value: token,
          href: platformUrl,
          external: false,
        });
      } else {
        segments.push({ type: "text", value: token });
      }
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", value: content.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: "text", value: content }];
}

function normalizePlatformUrl(raw: string): string | null {
  const trimmed = raw.trim().replace(/[),.;!?]+$/g, "");
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    if (!isPlatformHost(normalizeHost(parsed.hostname))) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function displayHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
