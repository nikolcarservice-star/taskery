import type { ContractStatus } from "@/generated/prisma/client";
import { siteUrl } from "@/lib/site-url";

export type ExternalContactCheck = {
  blocked: boolean;
  reason: "url" | "email" | "phone" | "messenger" | "social" | null;
  match: string | null;
};

const EMAIL_PATTERN =
  /[a-z0-9._%+-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z]{2,})/gi;

const PHONE_PATTERN =
  /(?:\+?\d{1,3}[\s().-]?)?(?:\(?\d{2,4}\)?[\s().-]?)?\d{3}[\s().-]?\d{2,3}[\s().-]?\d{2,3}(?:[\s().-]?\d{1,4})?/g;

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<>"']+/gi;

const BARE_DOMAIN_PATTERN =
  /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|net|org|io|me|co|ua|pl|dev|app|link|xyz|info|biz|ru|uk|edu|cc|gg|tv|pro|online|site|tech|cloud)(?:\/[^\s<>"']*)?\b/gi;

const MESSENGER_KEYWORDS = [
  /\b(?:telegram|телеграм\w*|tg)\b/i,
  /\b(?:whatsapp|вотсап\w*|wa\.me)\b/i,
  /\b(?:viber|вайбер\w*)\b/i,
  /\b(?:signal|сигнал)\b/i,
  /\b(?:discord|дискорд)\b/i,
  /\b(?:skype|скайп)\b/i,
  /\b(?:instagram|инстаграм\w*|insta)\b/i,
  /\b(?:facebook|фейсбук\w*|fb)\b/i,
  /\b(?:вконтакте|vkontakte|vk)\b/i,
  /\b(?:tiktok|тик\s*ток)\b/i,
  /\b(?:snapchat)\b/i,
  /\b(?:linkedin)\b/i,
  /\b(?:zoom|google\s+meet|meet\.google)\b/i,
  /\b(?:messenger|мессенджер\w*)\b/i,
];

const MESSENGER_HANDLE_PATTERN =
  /(?:t\.me|telegram\.me|wa\.me|discord\.gg|vk\.com|instagram\.com|facebook\.com|fb\.com|x\.com|twitter\.com|tiktok\.com)\/[^\s]+/gi;

const SOCIAL_AT_HANDLE_PATTERN =
  /(?:^|[\s(,;])(@[a-zA-Z0-9_][a-zA-Z0-9_.]{2,31})\b/g;

const CONTACT_INVITE_PATTERN =
  /\b(?:пишите|напишите|пиши|контакт|добавь|add\s+me|свяжись|свяжитесь|мой\s+(?:тг|tg|telegram|insta|вк))\b/i;

function getPlatformHosts(): Set<string> {
  const hosts = new Set(["localhost", "127.0.0.1"]);
  try {
    const hostname = new URL(siteUrl).hostname.toLowerCase();
    hosts.add(hostname);
    if (hostname.startsWith("www.")) {
      hosts.add(hostname.slice(4));
    } else {
      hosts.add(`www.${hostname}`);
    }
  } catch {
    hosts.add("taskery.com");
    hosts.add("www.taskery.com");
  }
  return hosts;
}

export function normalizeHost(value: string): string {
  return value.toLowerCase().replace(/^www\./, "");
}

export function isPlatformHost(host: string): boolean {
  const normalized = normalizeHost(host);
  const allowed = getPlatformHosts();
  for (const item of allowed) {
    const allowedHost = normalizeHost(item);
    if (normalized === allowedHost || normalized.endsWith(`.${allowedHost}`)) {
      return true;
    }
  }
  return false;
}

function hostFromUrlLike(value: string): string | null {
  const trimmed = value.trim().replace(/[),.;!?]+$/g, "");
  try {
    const withProtocol = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    return normalizeHost(new URL(withProtocol).hostname);
  } catch {
    const bare = trimmed.replace(/^www\./i, "").split("/")[0];
    if (!bare.includes(".")) return null;
    return normalizeHost(bare);
  }
}

function firstExternalUrlMatch(content: string): string | null {
  const patterns = [URL_PATTERN, MESSENGER_HANDLE_PATTERN, BARE_DOMAIN_PATTERN];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    const match = pattern.exec(content);
    if (!match) continue;
    const host = hostFromUrlLike(match[0]);
    if (host && !isPlatformHost(host)) {
      return match[0];
    }
  }
  return null;
}

function firstEmailMatch(content: string): string | null {
  EMAIL_PATTERN.lastIndex = 0;
  return EMAIL_PATTERN.exec(content)?.[0] ?? null;
}

function firstPhoneMatch(content: string): string | null {
  PHONE_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = PHONE_PATTERN.exec(content)) !== null) {
    const digits = match[0].replace(/\D/g, "");
    if (digits.length >= 9 && digits.length <= 15) {
      return match[0];
    }
  }
  return null;
}

function hasMessengerKeyword(content: string): boolean {
  return MESSENGER_KEYWORDS.some((pattern) => pattern.test(content));
}

function firstSocialHandleMatch(content: string): string | null {
  if (!CONTACT_INVITE_PATTERN.test(content) && !hasMessengerKeyword(content)) {
    return null;
  }

  SOCIAL_AT_HANDLE_PATTERN.lastIndex = 0;
  const match = SOCIAL_AT_HANDLE_PATTERN.exec(content);
  return match?.[1] ?? null;
}

function firstMessengerPathMatch(content: string): string | null {
  MESSENGER_HANDLE_PATTERN.lastIndex = 0;
  return MESSENGER_HANDLE_PATTERN.exec(content)?.[0] ?? null;
}

function detectContactsOnly(content: string): ExternalContactCheck {
  const emailMatch = firstEmailMatch(content);
  if (emailMatch) {
    return { blocked: true, reason: "email", match: emailMatch };
  }

  const phoneMatch = firstPhoneMatch(content);
  if (phoneMatch) {
    return { blocked: true, reason: "phone", match: phoneMatch };
  }

  const messengerPath = firstMessengerPathMatch(content);
  if (messengerPath) {
    return { blocked: true, reason: "messenger", match: messengerPath };
  }

  if (hasMessengerKeyword(content)) {
    return { blocked: true, reason: "messenger", match: content.slice(0, 120) };
  }

  const socialHandle = firstSocialHandleMatch(content);
  if (socialHandle) {
    return { blocked: true, reason: "social", match: socialHandle };
  }

  return { blocked: false, reason: null, match: null };
}

export function detectOffPlatformContacts(content: string): ExternalContactCheck {
  const normalized = content.trim();
  if (!normalized) {
    return { blocked: false, reason: null, match: null };
  }

  return detectContactsOnly(normalized);
}

export function detectExternalContactAttempt(content: string): ExternalContactCheck {
  const normalized = content.trim();
  if (!normalized) {
    return { blocked: false, reason: null, match: null };
  }

  const urlMatch = firstExternalUrlMatch(normalized);
  if (urlMatch) {
    return { blocked: true, reason: "url", match: urlMatch };
  }

  return detectContactsOnly(normalized);
}

export function shouldGuardProjectMessages(
  contractStatus: ContractStatus | null | undefined,
): boolean {
  return contractStatus !== "ESCROWED";
}

export function shouldWarnExternalLinks(
  contractStatus: ContractStatus | null | undefined,
): boolean {
  return contractStatus === "ESCROWED";
}

export function truncateBlockedSnippet(content: string, max = 280): string {
  const trimmed = content.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
}
