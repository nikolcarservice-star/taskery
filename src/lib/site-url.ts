export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taskery.com";

export function absoluteUrl(path: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
