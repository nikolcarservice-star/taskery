export const TASKBOOST_BRAND = {
  name: "TaskBoost",
  tagline: "Премиум для фрилансеров Taskery",
  shortDescription:
    "Больше видимости в каталоге, приоритет в поиске и инструменты, которые помогают чаще получать проекты.",
} as const;

export const TASKBOOST_FEATURES = [
  {
    title: "Приоритет в каталоге",
    description:
      "Ваш профиль показывается выше в результатах поиска — заказчики видят вас раньше конкурентов.",
    icon: "search",
  },
  {
    title: "Бейдж TaskBoost",
    description:
      "Отметка премиум-исполнителя в профиле и карточках — больше доверия с первого взгляда.",
    icon: "badge",
  },
  {
    title: "Выделенный профиль",
    description:
      "30 дней акцентного оформления профиля — заметнее в ленте и рекомендациях.",
    icon: "sparkle",
  },
  {
    title: "Безлимитные отклики",
    description:
      "Откликайтесь на проекты без ограничений и не упускайте подходящие заказы.",
    icon: "infinity",
  },
  {
    title: "Больше приглашений",
    description:
      "Заказчики чаще находят вас через фильтры и подборки активных исполнителей.",
    icon: "invite",
  },
  {
    title: "Приоритетная поддержка",
    description:
      "Быстрее получаете ответы от команды Taskery по вопросам сделок и аккаунта.",
    icon: "support",
  },
] as const;

export const TASKBOOST_COMPARISON = [
  { label: "Публикация профиля и отклики", free: true, boost: true },
  { label: "Эскроу-сделки", free: true, boost: true },
  { label: "Приоритет в поиске", free: false, boost: true },
  { label: "Бейдж TaskBoost", free: false, boost: true },
  { label: "Выделенный профиль 30 дней", free: false, boost: true },
  { label: "Безлимитные отклики", free: false, boost: true },
  { label: "Приоритетная поддержка", free: false, boost: true },
] as const;

export const TASKBOOST_FAQ = [
  {
    question: "Чем TaskBoost отличается от бесплатного плана?",
    answer:
      "TaskBoost добавляет продвижение профиля, бейдж премиум-исполнителя и приоритет в каталоге. Базовые сделки и эскроу доступны всем.",
  },
  {
    question: "Можно ли отменить подписку?",
    answer:
      "Да. Подписка продлевается ежемесячно, отключить автопродление можно в любой момент в настройках оплаты Stripe.",
  },
  {
    question: "TaskBoost для заказчиков?",
    answer:
      "TaskBoost создан только для фрилансеров. Заказчики пользуются платформой бесплатно — комиссия 10% удерживается из суммы сделки при её завершении.",
  },
] as const;
