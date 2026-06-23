/**
 * Allows only same-origin relative paths (no protocol-relative or external URLs).
 */
export function safeRedirectPath(
  value: string | null | undefined,
  fallback = "/",
): string {
  if (!value) return fallback;

  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  if (trimmed.includes("\\") || trimmed.includes("\0")) {
    return fallback;
  }

  try {
    const url = new URL(trimmed, "http://local.invalid");
    if (url.origin !== "http://local.invalid") {
      return fallback;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
