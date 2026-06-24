import type { AppLocale } from "@/lib/i18n/types";

export type AdminPanelsCopy = {
  common: {
    done: string;
    ok: string;
    block: string;
    blockReason: string;
    blocked: string;
    close: string;
    client: string;
    openThread: string;
    user: string;
    blockedText: string;
    approve: string;
    reject: string;
    rejectReason: string;
    reason: string;
    sending: string;
    reply: string;
    replySent: string;
  };
  attention: {
    titleEmpty: string;
    bodyEmpty: string;
    title: string;
    body: string;
    sourceConversation: string;
    sourceBid: string;
  };
  disputes: {
    title: string;
    empty: string;
    openChat: string;
    releaseToFreelancer: string;
    refundToClient: string;
    splitHide: string;
    splitShow: string;
    splitPercent: string;
    splitApply: string;
    splitApplying: string;
    splitResolved: string;
    resolved: string;
  };
  openProjects: {
    title: string;
    empty: string;
  };
  pendingProjects: {
    title: string;
    empty: string;
  };
  contentModeration: {
    title: string;
    avatars: string;
    portfolio: string;
    empty: string;
  };
  support: {
    titleEmpty: string;
    bodyEmpty: string;
    title: string;
    replyPlaceholder: string;
    closeTicket: string;
    markResolved: string;
    staffPrefix: string;
    userPrefix: string;
    categories: Record<string, string>;
    statuses: Record<string, string>;
  };
  reports: {
    titleEmpty: string;
    bodyEmpty: string;
    title: string;
    subtitle: string;
    exportCsv: string;
    takeReview: string;
    commentPlaceholder: string;
    resolveNoSanctions: string;
    dismissAllNote: string;
    dismissAll: string;
    blockProjectReason: string;
    blockProject: string;
    blockClientReason: string;
    blockClient: string;
    deleteClientReason: string;
    deleteClient: string;
    blockUserReason: string;
    blockUser: string;
    deleteUserReason: string;
    deleteUser: string;
    projectGroup: string;
    inReview: string;
    budgetClient: string;
    underpriced: string;
    inQueue: string;
    otherReports: string;
    userGroup: string;
    reportsWord: string;
    objectsOne: string;
    objectsFew: string;
    objectsMany: string;
    reasons: Record<string, string>;
    statuses: Record<string, string>;
  };
};

const REPORT_REASONS_RU: Record<string, string> = {
  UNDERPRICED: "Заниженная цена",
  SPAM: "Спам",
  FRAUD: "Мошенничество",
  HARASSMENT: "Оскорбления",
  IRRELEVANT: "Нерелевантно",
  POLICY_VIOLATION: "Нарушение правил",
  FAKE_PROFILE: "Фейковый профиль",
  OTHER: "Другое",
};

const SUPPORT_CATEGORIES_RU: Record<string, string> = {
  GENERAL: "Общее",
  PAYMENT: "Оплата",
  DISPUTE: "Спор",
  ACCOUNT: "Аккаунт",
  OTHER: "Другое",
};

export const ADMIN_PANELS_COPY: Record<AppLocale, AdminPanelsCopy> = {
  ru: {
    common: {
      done: "Готово",
      ok: "OK",
      block: "Заблокировать",
      blockReason: "Причина блокировки",
      blocked: "Заблокирован",
      close: "Закрыть",
      client: "Заказчик",
      openThread: "Открыть переписку",
      user: "Пользователь",
      blockedText: "Заблокированный текст",
      approve: "Одобрить",
      reject: "Отклонить",
      rejectReason: "Причина отклонения",
      reason: "Причина",
      sending: "Отправка…",
      reply: "Ответить",
      replySent: "Ответ отправлен",
    },
    attention: {
      titleEmpty: "Внимание (0)",
      bodyEmpty: "Попыток обойти правила общения не зафиксировано",
      title: "Внимание",
      body: "Попытки отправить внешние контакты или ссылки до оплаты проекта",
      sourceConversation: "Чат проекта",
      sourceBid: "Переписка по отклику",
    },
    disputes: {
      title: "Споры",
      empty: "Активных споров нет",
      openChat: "Открыть чат спора",
      releaseToFreelancer: "Выплатить исполнителю",
      refundToClient: "Вернуть заказчику",
      splitHide: "Скрыть частичное решение",
      splitShow: "Частичное решение",
      splitPercent: "Процент исполнителю (1–99)",
      splitApply: "Разделить сумму",
      splitApplying: "Применяем…",
      splitResolved: "Спор решён частично",
      resolved: "Спор решён",
    },
    openProjects: {
      title: "Открытые проекты",
      empty: "Нет открытых проектов",
    },
    pendingProjects: {
      title: "Премодерация проектов",
      empty: "Нет проектов в очереди",
    },
    contentModeration: {
      title: "Модерация контента",
      avatars: "Аватары",
      portfolio: "Портфолио",
      empty: "Очередь пуста",
    },
    support: {
      titleEmpty: "Поддержка (0)",
      bodyEmpty: "Открытых обращений нет",
      title: "Поддержка",
      replyPlaceholder: "Ответ пользователю",
      closeTicket: "Закрыть обращение",
      markResolved: "Отметить решённым",
      staffPrefix: "Поддержка:",
      userPrefix: "Пользователь:",
      categories: SUPPORT_CATEGORIES_RU,
      statuses: {
        OPEN: "Новое",
        IN_PROGRESS: "В работе",
        RESOLVED: "Решено",
        CLOSED: "Закрыто",
      },
    },
    reports: {
      titleEmpty: "Жалобы (0)",
      bodyEmpty: "Новых жалоб нет",
      title: "Жалобы",
      subtitle: "Жалобы сгруппированы по проекту или пользователю",
      exportCsv: "Экспорт CSV",
      takeReview: "Взять в работу",
      commentPlaceholder: "Комментарий",
      resolveNoSanctions: "Решить без санкций",
      dismissAllNote: "Заметка при отклонении всех жалоб",
      dismissAll: "Отклонить все",
      blockProjectReason: "Причина блокировки проекта",
      blockProject: "Заблокировать проект",
      blockClientReason: "Причина блокировки заказчика",
      blockClient: "Заблокировать заказчика",
      deleteClientReason: "Причина удаления заказчика",
      deleteClient: "Удалить заказчика",
      blockUserReason: "Причина блокировки",
      blockUser: "Заблокировать пользователя",
      deleteUserReason: "Причина удаления",
      deleteUser: "Удалить пользователя",
      projectGroup: "Проект",
      inReview: "На проверке",
      budgetClient: "Бюджет",
      underpriced: "Заниженная цена",
      inQueue: "в очереди",
      otherReports: "Других жалоб на проект",
      userGroup: "Пользователь",
      reportsWord: "жалоб",
      objectsOne: "объект",
      objectsFew: "объекта",
      objectsMany: "объектов",
      reasons: REPORT_REASONS_RU,
      statuses: {
        PENDING: "Новая",
        IN_REVIEW: "В работе",
      },
    },
  },
  uk: {
    common: {
      done: "Готово",
      ok: "OK",
      block: "Заблокувати",
      blockReason: "Причина блокування",
      blocked: "Заблоковано",
      close: "Закрити",
      client: "Замовник",
      openThread: "Відкрити переписку",
      user: "Користувач",
      blockedText: "Заблокований текст",
      approve: "Схвалити",
      reject: "Відхилити",
      rejectReason: "Причина відхилення",
      reason: "Причина",
      sending: "Надсилання…",
      reply: "Відповісти",
      replySent: "Відповідь надіслано",
    },
    attention: {
      titleEmpty: "Увага (0)",
      bodyEmpty: "Спроб обійти правила спілкування не зафіксовано",
      title: "Увага",
      body: "Спроби надіслати зовнішні контакти або посилання до оплати проєкту",
      sourceConversation: "Чат проєкту",
      sourceBid: "Переписка за відгуком",
    },
    disputes: {
      title: "Спори",
      empty: "Активних спорів немає",
      openChat: "Відкрити чат спору",
      releaseToFreelancer: "Виплатити виконавцю",
      refundToClient: "Повернути замовнику",
      splitHide: "Приховати часткове рішення",
      splitShow: "Часткове рішення",
      splitPercent: "Відсоток виконавцю (1–99)",
      splitApply: "Розділити суму",
      splitApplying: "Застосовуємо…",
      splitResolved: "Спір вирішено частково",
      resolved: "Спір вирішено",
    },
    openProjects: {
      title: "Відкриті проєкти",
      empty: "Немає відкритих проєктів",
    },
    pendingProjects: {
      title: "Премодерація проєктів",
      empty: "Немає проєктів у черзі",
    },
    contentModeration: {
      title: "Модерація контенту",
      avatars: "Аватари",
      portfolio: "Портфоліо",
      empty: "Черга порожня",
    },
    support: {
      titleEmpty: "Підтримка (0)",
      bodyEmpty: "Відкритих звернень немає",
      title: "Підтримка",
      replyPlaceholder: "Відповідь користувачу",
      closeTicket: "Закрити звернення",
      markResolved: "Позначити вирішеним",
      staffPrefix: "Підтримка:",
      userPrefix: "Користувач:",
      categories: {
        GENERAL: "Загальне",
        PAYMENT: "Оплата",
        DISPUTE: "Спір",
        ACCOUNT: "Акаунт",
        OTHER: "Інше",
      },
      statuses: {
        OPEN: "Нове",
        IN_PROGRESS: "В роботі",
        RESOLVED: "Вирішено",
        CLOSED: "Закрито",
      },
    },
    reports: {
      titleEmpty: "Скарги (0)",
      bodyEmpty: "Нових скарг немає",
      title: "Скарги",
      subtitle: "Скарги згруповані за проєктом або користувачем",
      exportCsv: "Експорт CSV",
      takeReview: "Взяти в роботу",
      commentPlaceholder: "Коментар",
      resolveNoSanctions: "Вирішити без санкцій",
      dismissAllNote: "Нотатка при відхиленні всіх скарг",
      dismissAll: "Відхилити всі",
      blockProjectReason: "Причина блокування проєкту",
      blockProject: "Заблокувати проєкт",
      blockClientReason: "Причина блокування замовника",
      blockClient: "Заблокувати замовника",
      deleteClientReason: "Причина видалення замовника",
      deleteClient: "Видалити замовника",
      blockUserReason: "Причина блокування",
      blockUser: "Заблокувати користувача",
      deleteUserReason: "Причина видалення",
      deleteUser: "Видалити користувача",
      projectGroup: "Проєкт",
      inReview: "На перевірці",
      budgetClient: "Бюджет",
      underpriced: "Занижена ціна",
      inQueue: "у черзі",
      otherReports: "Інших скарг на проєкт",
      userGroup: "Користувач",
      reportsWord: "скарг",
      objectsOne: "об'єкт",
      objectsFew: "об'єкти",
      objectsMany: "об'єктів",
      reasons: {
        UNDERPRICED: "Занижена ціна",
        SPAM: "Спам",
        FRAUD: "Шахрайство",
        HARASSMENT: "Образи",
        IRRELEVANT: "Нерелевантно",
        POLICY_VIOLATION: "Порушення правил",
        FAKE_PROFILE: "Фейковий профіль",
        OTHER: "Інше",
      },
      statuses: {
        PENDING: "Нова",
        IN_REVIEW: "В роботі",
      },
    },
  },
  pl: {
    common: {
      done: "Gotowe",
      ok: "OK",
      block: "Zablokuj",
      blockReason: "Powód blokady",
      blocked: "Zablokowano",
      close: "Zamknij",
      client: "Zleceniodawca",
      openThread: "Otwórz rozmowę",
      user: "Użytkownik",
      blockedText: "Zablokowany tekst",
      approve: "Zatwierdź",
      reject: "Odrzuć",
      rejectReason: "Powód odrzucenia",
      reason: "Powód",
      sending: "Wysyłanie…",
      reply: "Odpowiedz",
      replySent: "Odpowiedź wysłana",
    },
    attention: {
      titleEmpty: "Uwaga (0)",
      bodyEmpty: "Nie wykryto prób obejścia zasad komunikacji",
      title: "Uwaga",
      body: "Próby wysłania zewnętrznych kontaktów lub linków przed opłatą projektu",
      sourceConversation: "Czat projektu",
      sourceBid: "Rozmowa przy ofercie",
    },
    disputes: {
      title: "Spory",
      empty: "Brak aktywnych sporów",
      openChat: "Otwórz czat sporu",
      releaseToFreelancer: "Wypłać wykonawcy",
      refundToClient: "Zwróć zleceniodawcy",
      splitHide: "Ukryj częściowe rozstrzygnięcie",
      splitShow: "Częściowe rozstrzygnięcie",
      splitPercent: "Procent dla wykonawcy (1–99)",
      splitApply: "Podziel kwotę",
      splitApplying: "Stosowanie…",
      splitResolved: "Spór rozstrzygnięty częściowo",
      resolved: "Spór rozstrzygnięty",
    },
    openProjects: {
      title: "Otwarte projekty",
      empty: "Brak otwartych projektów",
    },
    pendingProjects: {
      title: "Premoderacja projektów",
      empty: "Brak projektów w kolejce",
    },
    contentModeration: {
      title: "Moderacja treści",
      avatars: "Awatary",
      portfolio: "Portfolio",
      empty: "Kolejka pusta",
    },
    support: {
      titleEmpty: "Wsparcie (0)",
      bodyEmpty: "Brak otwartych zgłoszeń",
      title: "Wsparcie",
      replyPlaceholder: "Odpowiedź użytkownikowi",
      closeTicket: "Zamknij zgłoszenie",
      markResolved: "Oznacz jako rozwiązane",
      staffPrefix: "Wsparcie:",
      userPrefix: "Użytkownik:",
      categories: {
        GENERAL: "Ogólne",
        PAYMENT: "Płatność",
        DISPUTE: "Spór",
        ACCOUNT: "Konto",
        OTHER: "Inne",
      },
      statuses: {
        OPEN: "Nowe",
        IN_PROGRESS: "W toku",
        RESOLVED: "Rozwiązane",
        CLOSED: "Zamknięte",
      },
    },
    reports: {
      titleEmpty: "Zgłoszenia (0)",
      bodyEmpty: "Brak nowych zgłoszeń",
      title: "Zgłoszenia",
      subtitle: "Zgłoszenia pogrupowane według projektu lub użytkownika",
      exportCsv: "Eksport CSV",
      takeReview: "Przejmij",
      commentPlaceholder: "Komentarz",
      resolveNoSanctions: "Rozwiąż bez sankcji",
      dismissAllNote: "Notatka przy odrzuceniu wszystkich zgłoszeń",
      dismissAll: "Odrzuć wszystkie",
      blockProjectReason: "Powód blokady projektu",
      blockProject: "Zablokuj projekt",
      blockClientReason: "Powód blokady zleceniodawcy",
      blockClient: "Zablokuj zleceniodawcę",
      deleteClientReason: "Powód usunięcia zleceniodawcy",
      deleteClient: "Usuń zleceniodawcę",
      blockUserReason: "Powód blokady",
      blockUser: "Zablokuj użytkownika",
      deleteUserReason: "Powód usunięcia",
      deleteUser: "Usuń użytkownika",
      projectGroup: "Projekt",
      inReview: "W weryfikacji",
      budgetClient: "Budżet",
      underpriced: "Zaniżona cena",
      inQueue: "w kolejce",
      otherReports: "Innych zgłoszeń do projektu",
      userGroup: "Użytkownik",
      reportsWord: "zgłoszeń",
      objectsOne: "obiekt",
      objectsFew: "obiekty",
      objectsMany: "obiektów",
      reasons: {
        UNDERPRICED: "Zaniżona cena",
        SPAM: "Spam",
        FRAUD: "Oszustwo",
        HARASSMENT: "Obraźliwe treści",
        IRRELEVANT: "Nierelewantne",
        POLICY_VIOLATION: "Naruszenie zasad",
        FAKE_PROFILE: "Fałszywy profil",
        OTHER: "Inne",
      },
      statuses: {
        PENDING: "Nowe",
        IN_REVIEW: "W toku",
      },
    },
  },
  en: {
    common: {
      done: "Done",
      ok: "OK",
      block: "Block",
      blockReason: "Block reason",
      blocked: "Blocked",
      close: "Close",
      client: "Client",
      openThread: "Open conversation",
      user: "User",
      blockedText: "Blocked text",
      approve: "Approve",
      reject: "Reject",
      rejectReason: "Rejection reason",
      reason: "Reason",
      sending: "Sending…",
      reply: "Reply",
      replySent: "Reply sent",
    },
    attention: {
      titleEmpty: "Attention (0)",
      bodyEmpty: "No attempts to bypass communication rules detected",
      title: "Attention",
      body: "Attempts to share external contacts or links before project payment",
      sourceConversation: "Project chat",
      sourceBid: "Bid conversation",
    },
    disputes: {
      title: "Disputes",
      empty: "No active disputes",
      openChat: "Open dispute chat",
      releaseToFreelancer: "Pay freelancer",
      refundToClient: "Refund client",
      splitHide: "Hide partial resolution",
      splitShow: "Partial resolution",
      splitPercent: "Freelancer percent (1–99)",
      splitApply: "Split amount",
      splitApplying: "Applying…",
      splitResolved: "Dispute partially resolved",
      resolved: "Dispute resolved",
    },
    openProjects: {
      title: "Open projects",
      empty: "No open projects",
    },
    pendingProjects: {
      title: "Project pre-moderation",
      empty: "No projects in queue",
    },
    contentModeration: {
      title: "Content moderation",
      avatars: "Avatars",
      portfolio: "Portfolio",
      empty: "Queue is empty",
    },
    support: {
      titleEmpty: "Support (0)",
      bodyEmpty: "No open tickets",
      title: "Support",
      replyPlaceholder: "Reply to user",
      closeTicket: "Close ticket",
      markResolved: "Mark resolved",
      staffPrefix: "Support:",
      userPrefix: "User:",
      categories: {
        GENERAL: "General",
        PAYMENT: "Payment",
        DISPUTE: "Dispute",
        ACCOUNT: "Account",
        OTHER: "Other",
      },
      statuses: {
        OPEN: "New",
        IN_PROGRESS: "In progress",
        RESOLVED: "Resolved",
        CLOSED: "Closed",
      },
    },
    reports: {
      titleEmpty: "Reports (0)",
      bodyEmpty: "No new reports",
      title: "Reports",
      subtitle: "Reports grouped by project or user",
      exportCsv: "Export CSV",
      takeReview: "Take for review",
      commentPlaceholder: "Comment",
      resolveNoSanctions: "Resolve without sanctions",
      dismissAllNote: "Note when dismissing all reports",
      dismissAll: "Dismiss all",
      blockProjectReason: "Project block reason",
      blockProject: "Block project",
      blockClientReason: "Client block reason",
      blockClient: "Block client",
      deleteClientReason: "Client deletion reason",
      deleteClient: "Delete client",
      blockUserReason: "Block reason",
      blockUser: "Block user",
      deleteUserReason: "Deletion reason",
      deleteUser: "Delete user",
      projectGroup: "Project",
      inReview: "Under review",
      budgetClient: "Budget",
      underpriced: "Underpriced",
      inQueue: "in queue",
      otherReports: "Other reports on project",
      userGroup: "User",
      reportsWord: "reports",
      objectsOne: "item",
      objectsFew: "items",
      objectsMany: "items",
      reasons: {
        UNDERPRICED: "Underpriced",
        SPAM: "Spam",
        FRAUD: "Fraud",
        HARASSMENT: "Harassment",
        IRRELEVANT: "Irrelevant",
        POLICY_VIOLATION: "Policy violation",
        FAKE_PROFILE: "Fake profile",
        OTHER: "Other",
      },
      statuses: {
        PENDING: "New",
        IN_REVIEW: "In review",
      },
    },
  },
};

export function getAdminPanelsCopy(locale: AppLocale): AdminPanelsCopy {
  return ADMIN_PANELS_COPY[locale] ?? ADMIN_PANELS_COPY.ru;
}

export function adminReportObjectsLabel(
  count: number,
  labels: Pick<AdminPanelsCopy["reports"], "objectsOne" | "objectsFew" | "objectsMany">,
  locale: AppLocale,
): string {
  if (locale === "en") {
    return count === 1 ? labels.objectsOne : labels.objectsMany;
  }

  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return labels.objectsOne;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return labels.objectsFew;
  }
  return labels.objectsMany;
}
