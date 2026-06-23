import type { ContractStatus, ProjectStatus } from "@/generated/prisma/client";

export const PROJECT_LIFECYCLE_STEPS = [
  { id: "published", label: "Публикация" },
  { id: "bids", label: "Приём откликов" },
  { id: "selection", label: "Выбор исполнителя" },
  { id: "escrow", label: "Эскроу" },
  { id: "work", label: "Выполнение" },
  { id: "reviews", label: "Обмен отзывами" },
] as const;

export function getProjectLifecycleStep(
  status: ProjectStatus,
  contractStatus?: ContractStatus | null,
): number {
  if (status === "CLOSED") {
    return contractStatus === "RELEASED" ? 5 : 4;
  }

  if (status === "UNDER_DISPUTE") {
    return 4;
  }

  if (status === "IN_PROGRESS") {
    return contractStatus === "ESCROWED" ? 4 : 3;
  }

  // OPEN: публикация завершена, идёт приём откликов
  return 1;
}

export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  if (days < 7) return `${days} дн. назад`;

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
}

export function formatDeadlineCountdown(deadline: Date | null): string | null {
  if (!deadline) return null;

  const diffMs = deadline.getTime() - Date.now();
  if (diffMs <= 0) return "Срок истёк";

  const days = Math.floor(diffMs / 86_400_000);
  const hours = Math.floor((diffMs % 86_400_000) / 3_600_000);

  if (days > 0) {
    return `${days} дн. ${hours} ч.`;
  }

  return `${hours} ч.`;
}
