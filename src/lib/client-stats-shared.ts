export type ClientOrderStats = {
  completedProjects: number;
  uncompletedProjects: number;
  reviewsReceived: number;
  rating: number;
};

export const BAD_CLIENT_RATING_THRESHOLD = 3.5;
export const MIN_CLIENT_REVIEWS_FOR_RATING_WARNING = 2;

export function getClientRatingWarning(stats: ClientOrderStats): string | null {
  if (
    stats.reviewsReceived < MIN_CLIENT_REVIEWS_FOR_RATING_WARNING ||
    stats.rating <= 0 ||
    stats.rating >= BAD_CLIENT_RATING_THRESHOLD
  ) {
    return null;
  }

  return `Низкий рейтинг заказчика — ${stats.rating.toFixed(1)} из 5 по ${stats.reviewsReceived} отзывам.`;
}

export function getClientReliabilityWarning(
  stats: ClientOrderStats,
): string | null {
  const total = stats.completedProjects + stats.uncompletedProjects;

  if (total === 0) {
    return null;
  }

  if (stats.completedProjects === 0 && stats.uncompletedProjects > 0) {
    return "У заказчика пока нет успешно завершённых проектов на платформе.";
  }

  if (
    stats.uncompletedProjects >= 2 &&
    stats.uncompletedProjects > stats.completedProjects
  ) {
    return `Больше проблемных проектов (${stats.uncompletedProjects}), чем успешно завершённых (${stats.completedProjects}).`;
  }

  return null;
}

export function getFreelancerClientWarnings(
  stats: ClientOrderStats,
): string[] {
  return [
    getClientRatingWarning(stats),
    getClientReliabilityWarning(stats),
  ].filter((message): message is string => message !== null);
}
