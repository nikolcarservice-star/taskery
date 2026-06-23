import type { Dictionary } from "@/lib/i18n/types";

export function formatRelativeTime(date: Date, time: Dictionary["time"]): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return time.justNow;
  if (minutes < 60) return time.minutesAgo.replace("{count}", String(minutes));
  if (hours < 24) return time.hoursAgo.replace("{count}", String(hours));
  if (days < 7) return time.daysAgo.replace("{count}", String(days));

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

export function unreadShort(count: number, template: string): string {
  return template.replace("{count}", String(count));
}
