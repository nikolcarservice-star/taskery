export function formatRelativeTime(date: Date, now = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return "только что";
  if (diffMin < 60) return `${diffMin} мин. назад`;
  if (diffHour < 24) return `${diffHour} ч. назад`;
  if (diffDay === 1) return "вчера";
  if (diffDay < 7) return `${diffDay} дн. назад`;
  if (diffMonth < 12) {
    const mod10 = diffMonth % 10;
    const mod100 = diffMonth % 100;
    if (mod10 === 1 && mod100 !== 11) return `${diffMonth} месяц назад`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      return `${diffMonth} месяца назад`;
    }
    return `${diffMonth} месяцев назад`;
  }
  if (diffYear === 1) return "год назад";
  return `${diffYear} лет назад`;
}
