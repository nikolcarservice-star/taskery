const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function isSafeHttpUrl(value: string | null | undefined): boolean {
  if (!value?.trim()) return false;

  try {
    const url = new URL(value.trim());
    return ALLOWED_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

export function sanitizeHttpUrl(
  value: string | null | undefined,
): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  return isSafeHttpUrl(trimmed) ? trimmed : null;
}

export function sanitizeOptionalHttpUrl(
  value: string | null | undefined,
): string | null {
  if (!value?.trim()) return null;
  return sanitizeHttpUrl(value);
}

/** Relative site paths (e.g. uploaded avatars) or http(s) URLs. */
export function isSafeAssetUrl(value: string | null | undefined): boolean {
  if (!value?.trim()) return false;
  const trimmed = value.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return !trimmed.includes("\\") && !trimmed.includes("\0");
  }
  return isSafeHttpUrl(trimmed);
}
