import type { AdminTabDefinition, AdminTabKey, ModerationSectionKey } from "@/lib/admin-tabs";
import type { AdminPanelsCopy } from "@/lib/admin-i18n-panels";
import { ADMIN_PANELS_COPY } from "@/lib/admin-i18n-panels";
import type { AppLocale } from "@/lib/i18n/types";

type AdminCopy = {
  panelTitle: string;
  sections: string;
  navAria: string;
  tabNavAria: string;
  adminBadge: string;
  adminFallbackName: string;
  mobileVersion: string;
  desktopVersion: string;
  moreSettings: string;
  morePageDescription: string;
  backToCabinet: string;
  tabs: Record<
    AdminTabKey,
    {
      label: string;
      description: string;
    }
  >;
  moderationSections: Record<ModerationSectionKey, string>;
  overview: {
    statsUsers: string;
    statsClients: string;
    statsFreelancers: string;
    statsProjects: string;
    quickAccess: string;
    noPermissions: string;
  };
  usersSections: {
    verification: string;
    accounts: string;
  };
  financeSections: {
    withdrawals: string;
    overview: string;
  };
  platformSections: {
    catalog: string;
    cms: string;
    broadcast: string;
  };
  teamSections: {
    staff: string;
    audit: string;
  };
  mobileMore: {
    signedInAs: string;
    sections: string;
    workMode: string;
    workAsClient: string;
    workAsFreelancer: string;
    adminCabinet: string;
    signOut: string;
  };
  review: {
    backToModeration: string;
    moderationReview: string;
    adminCanWriteHint: string;
    projectChatTitle: string;
    bidChatTitle: string;
    clientFallback: string;
    freelancerFallback: string;
    emptyThread: string;
    blockedText: string;
    participant: string;
    adminLabel: string;
    composerLabel: string;
    composerPlaceholder: string;
    composerHint: string;
    sending: string;
    send: string;
  };
  attention: {
    dismiss: string;
    dismissTitle: string;
  };
  telegram: {
    title: string;
    hint: string;
    connect: string;
    linking: string;
    openBot: string;
    connectHint: string;
    connected: string;
    disconnect: string;
    alertsToggle: string;
    notConfigured: string;
  };
  panels: AdminPanelsCopy;
};

const ADMIN_COPY: Record<AppLocale, AdminCopy> = {
  ru: {
    panelTitle: "Админ-панель",
    sections: "Разделы",
    navAria: "Навигация админ-панели",
    tabNavAria: "Подразделы админ-панели",
    adminBadge: "Taskery Admin",
    adminFallbackName: "Админ",
    mobileVersion: "Мобильная версия",
    desktopVersion: "Полная версия",
    moreSettings: "Ещё",
    morePageDescription: "Дополнительные разделы и настройки",
    backToCabinet: "В кабинет",
    tabs: {
      overview: {
        label: "Обзор",
        description: "Сводка платформы и быстрые действия",
      },
      moderation: {
        label: "Модерация",
        description: "Жалобы, споры, контакты и поддержка",
      },
      users: {
        label: "Пользователи",
        description: "Верификация и управление аккаунтами",
      },
      finance: {
        label: "Финансы",
        description: "Эскроу, выводы и платежи",
      },
      platform: {
        label: "Платформа",
        description: "Каталог, CMS и рассылки",
      },
      team: {
        label: "Команда",
        description: "Администраторы и журнал действий",
      },
    },
    moderationSections: {
      attention: "Внимание",
      disputes: "Споры",
      reports: "Жалобы",
      projects: "Проекты",
      support: "Поддержка",
    },
    overview: {
      statsUsers: "Пользователей",
      statsClients: "Заказчиков",
      statsFreelancers: "Фрилансеров",
      statsProjects: "Проектов",
      quickAccess: "Быстрый доступ",
      noPermissions:
        "У вашего аккаунта нет назначенных функций. Обратитесь к супер-администратору.",
    },
    usersSections: {
      verification: "Верификация",
      accounts: "Аккаунты",
    },
    financeSections: {
      withdrawals: "Выводы",
      overview: "Обзор",
    },
    platformSections: {
      catalog: "Каталог",
      cms: "CMS",
      broadcast: "Рассылка",
    },
    teamSections: {
      staff: "Администраторы",
      audit: "Журнал",
    },
    mobileMore: {
      signedInAs: "Вход выполнен как",
      sections: "Разделы",
      workMode: "Режим работы",
      workAsClient: "Работа как заказчик",
      workAsFreelancer: "Работа как фрилансер",
      adminCabinet: "Кабинет администратора",
      signOut: "Выйти",
    },
    review: {
      backToModeration: "← Назад к модерации",
      moderationReview: "Просмотр для модерации",
      adminCanWriteHint:
        "Администратор может писать в чат от своего имени — участники увидят сообщение с пометкой «Администратор»",
      projectChatTitle: "Чат проекта",
      bidChatTitle: "Чат по отклику",
      clientFallback: "Заказчик",
      freelancerFallback: "Исполнитель",
      emptyThread:
        "Сообщений в переписке пока нет. Вы можете написать первым от имени администратора.",
      blockedText: "Заблокированный текст",
      participant: "Участник",
      adminLabel: "Администратор",
      composerLabel: "Сообщение от администратора",
      composerPlaceholder: "Напишите участникам от имени администратора Taskery…",
      composerHint:
        "Сообщение будет видно заказчику и исполнителю с вашим именем",
      sending: "Отправка…",
      send: "Отправить",
    },
    attention: {
      dismiss: "Скрыть",
      dismissTitle: "Скрыть уведомление только у вас",
    },
    telegram: {
      title: "Telegram для админов",
      hint: "Закрытый бот: уведомления модерации и финансов, управление кнопками.",
      connect: "Подключить админ-бот",
      linking: "Создание ссылки…",
      openBot: "Открыть админ-бот",
      connectHint: "Ссылка действует 15 минут. Не передавайте её посторонним.",
      connected: "Админ-бот подключён",
      disconnect: "Отключить",
      alertsToggle: "Уведомления модерации и финансов в Telegram",
      notConfigured: "Админ-бот не настроен на сервере (TELEGRAM_ADMIN_BOT_TOKEN)",
    },
    panels: ADMIN_PANELS_COPY.ru,
  },
  uk: {
    panelTitle: "Адмін-панель",
    sections: "Розділи",
    navAria: "Навігація адмін-панелі",
    tabNavAria: "Підрозділи адмін-панелі",
    adminBadge: "Taskery Admin",
    adminFallbackName: "Адмін",
    mobileVersion: "Мобільна версія",
    desktopVersion: "Повна версія",
    moreSettings: "Ще",
    morePageDescription: "Додаткові розділи та налаштування",
    backToCabinet: "До кабінету",
    tabs: {
      overview: {
        label: "Огляд",
        description: "Зведення платформи та швидкі дії",
      },
      moderation: {
        label: "Модерація",
        description: "Скарги, спори, контакти та підтримка",
      },
      users: {
        label: "Користувачі",
        description: "Верифікація та керування акаунтами",
      },
      finance: {
        label: "Фінанси",
        description: "Ескроу, виведення та платежі",
      },
      platform: {
        label: "Платформа",
        description: "Каталог, CMS і розсилки",
      },
      team: {
        label: "Команда",
        description: "Адміністратори та журнал дій",
      },
    },
    moderationSections: {
      attention: "Увага",
      disputes: "Спори",
      reports: "Скарги",
      projects: "Проєкти",
      support: "Підтримка",
    },
    overview: {
      statsUsers: "Користувачів",
      statsClients: "Замовників",
      statsFreelancers: "Фрілансерів",
      statsProjects: "Проєктів",
      quickAccess: "Швидкий доступ",
      noPermissions:
        "У вашого акаунта немає призначених функцій. Зверніться до супер-адміністратора.",
    },
    usersSections: {
      verification: "Верифікація",
      accounts: "Акаунти",
    },
    financeSections: {
      withdrawals: "Виведення",
      overview: "Огляд",
    },
    platformSections: {
      catalog: "Каталог",
      cms: "CMS",
      broadcast: "Розсилка",
    },
    teamSections: {
      staff: "Адміністратори",
      audit: "Журнал",
    },
    mobileMore: {
      signedInAs: "Вхід виконано як",
      sections: "Розділи",
      workMode: "Режим роботи",
      workAsClient: "Робота як замовник",
      workAsFreelancer: "Робота як фрілансер",
      adminCabinet: "Кабінет адміністратора",
      signOut: "Вийти",
    },
    review: {
      backToModeration: "← Назад до модерації",
      moderationReview: "Перегляд для модерації",
      adminCanWriteHint:
        "Адміністратор може писати в чат від свого імені — учасники побачать повідомлення з позначкою «Адміністратор»",
      projectChatTitle: "Чат проєкту",
      bidChatTitle: "Чат за відгуком",
      clientFallback: "Замовник",
      freelancerFallback: "Виконавець",
      emptyThread:
        "Повідомлень у переписці поки немає. Ви можете написати першим від імені адміністратора.",
      blockedText: "Заблокований текст",
      participant: "Учасник",
      adminLabel: "Адміністратор",
      composerLabel: "Повідомлення від адміністратора",
      composerPlaceholder:
        "Напишіть учасникам від імені адміністратора Taskery…",
      composerHint:
        "Повідомлення буде видно замовнику та виконавцю з вашим іменем",
      sending: "Надсилання…",
      send: "Надіслати",
    },
    attention: {
      dismiss: "Приховати",
      dismissTitle: "Приховати сповіщення лише у вас",
    },
    telegram: {
      title: "Telegram для адмінів",
      hint: "Закритий бот: сповіщення модерації та фінансів, керування кнопками.",
      connect: "Підключити адмін-бот",
      linking: "Створення посилання…",
      openBot: "Відкрити адмін-бот",
      connectHint: "Посилання діє 15 хвилин. Не передавайте його стороннім.",
      connected: "Адмін-бот підключено",
      disconnect: "Відключити",
      alertsToggle: "Сповіщення модерації та фінансів у Telegram",
      notConfigured: "Адмін-бот не налаштовано на сервері (TELEGRAM_ADMIN_BOT_TOKEN)",
    },
    panels: ADMIN_PANELS_COPY.uk,
  },
  pl: {
    panelTitle: "Panel admina",
    sections: "Sekcje",
    navAria: "Nawigacja panelu admina",
    tabNavAria: "Podsekcje panelu admina",
    adminBadge: "Taskery Admin",
    adminFallbackName: "Admin",
    mobileVersion: "Wersja mobilna",
    desktopVersion: "Wersja pełna",
    moreSettings: "Więcej",
    morePageDescription: "Dodatkowe sekcje i ustawienia",
    backToCabinet: "Do panelu",
    tabs: {
      overview: {
        label: "Przegląd",
        description: "Podsumowanie platformy i szybkie akcje",
      },
      moderation: {
        label: "Moderacja",
        description: "Zgłoszenia, spory, kontakty i wsparcie",
      },
      users: {
        label: "Użytkownicy",
        description: "Weryfikacja i zarządzanie kontami",
      },
      finance: {
        label: "Finanse",
        description: "Escrow, wypłaty i płatności",
      },
      platform: {
        label: "Platforma",
        description: "Katalog, CMS i mailingi",
      },
      team: {
        label: "Zespół",
        description: "Administratorzy i dziennik działań",
      },
    },
    moderationSections: {
      attention: "Uwaga",
      disputes: "Spory",
      reports: "Zgłoszenia",
      projects: "Projekty",
      support: "Wsparcie",
    },
    overview: {
      statsUsers: "Użytkowników",
      statsClients: "Zleceniodawców",
      statsFreelancers: "Freelancerów",
      statsProjects: "Projektów",
      quickAccess: "Szybki dostęp",
      noPermissions:
        "Twoje konto nie ma przypisanych uprawnień. Skontaktuj się z super-administratorem.",
    },
    usersSections: {
      verification: "Weryfikacja",
      accounts: "Konta",
    },
    financeSections: {
      withdrawals: "Wypłaty",
      overview: "Przegląd",
    },
    platformSections: {
      catalog: "Katalog",
      cms: "CMS",
      broadcast: "Mailing",
    },
    teamSections: {
      staff: "Administratorzy",
      audit: "Dziennik",
    },
    mobileMore: {
      signedInAs: "Zalogowano jako",
      sections: "Sekcje",
      workMode: "Tryb pracy",
      workAsClient: "Praca jako zleceniodawca",
      workAsFreelancer: "Praca jako freelancer",
      adminCabinet: "Panel administratora",
      signOut: "Wyloguj",
    },
    review: {
      backToModeration: "← Wróć do moderacji",
      moderationReview: "Podgląd moderacji",
      adminCanWriteHint:
        "Administrator może pisać na czacie w swoim imieniu — uczestnicy zobaczą wiadomość z oznaczeniem „Administrator”",
      projectChatTitle: "Czat projektu",
      bidChatTitle: "Czat oferty",
      clientFallback: "Zleceniodawca",
      freelancerFallback: "Wykonawca",
      emptyThread:
        "Brak wiadomości w rozmowie. Możesz napisać pierwszy jako administrator.",
      blockedText: "Zablokowany tekst",
      participant: "Uczestnik",
      adminLabel: "Administrator",
      composerLabel: "Wiadomość od administratora",
      composerPlaceholder:
        "Napisz do uczestników w imieniu administratora Taskery…",
      composerHint:
        "Wiadomość będzie widoczna dla zleceniodawcy i wykonawcy z Twoim imieniem",
      sending: "Wysyłanie…",
      send: "Wyślij",
    },
    attention: {
      dismiss: "Ukryj",
      dismissTitle: "Ukryj powiadomienie tylko u siebie",
    },
    telegram: {
      title: "Telegram dla adminów",
      hint: "Zamknięty bot: powiadomienia moderacji i finansów, sterowanie przyciskami.",
      connect: "Połącz bota admina",
      linking: "Tworzenie linku…",
      openBot: "Otwórz bota admina",
      connectHint: "Link ważny 15 minut. Nie udostępniaj go osobom trzecim.",
      connected: "Bot admina połączony",
      disconnect: "Odłącz",
      alertsToggle: "Powiadomienia moderacji i finansów w Telegramie",
      notConfigured: "Bot admina nie jest skonfigurowany na serwerze (TELEGRAM_ADMIN_BOT_TOKEN)",
    },
    panels: ADMIN_PANELS_COPY.pl,
  },
  en: {
    panelTitle: "Admin panel",
    sections: "Sections",
    navAria: "Admin panel navigation",
    tabNavAria: "Admin panel subsections",
    adminBadge: "Taskery Admin",
    adminFallbackName: "Admin",
    mobileVersion: "Mobile version",
    desktopVersion: "Desktop version",
    moreSettings: "More",
    morePageDescription: "Additional sections and settings",
    backToCabinet: "Back to cabinet",
    tabs: {
      overview: {
        label: "Overview",
        description: "Platform summary and quick actions",
      },
      moderation: {
        label: "Moderation",
        description: "Reports, disputes, contacts, and support",
      },
      users: {
        label: "Users",
        description: "Verification and account management",
      },
      finance: {
        label: "Finance",
        description: "Escrow, withdrawals, and payments",
      },
      platform: {
        label: "Platform",
        description: "Catalog, CMS, and broadcasts",
      },
      team: {
        label: "Team",
        description: "Administrators and audit log",
      },
    },
    moderationSections: {
      attention: "Attention",
      disputes: "Disputes",
      reports: "Reports",
      projects: "Projects",
      support: "Support",
    },
    overview: {
      statsUsers: "Users",
      statsClients: "Clients",
      statsFreelancers: "Freelancers",
      statsProjects: "Projects",
      quickAccess: "Quick access",
      noPermissions:
        "Your account has no assigned permissions. Contact the super-administrator.",
    },
    usersSections: {
      verification: "Verification",
      accounts: "Accounts",
    },
    financeSections: {
      withdrawals: "Withdrawals",
      overview: "Overview",
    },
    platformSections: {
      catalog: "Catalog",
      cms: "CMS",
      broadcast: "Broadcast",
    },
    teamSections: {
      staff: "Administrators",
      audit: "Audit log",
    },
    mobileMore: {
      signedInAs: "Signed in as",
      sections: "Sections",
      workMode: "Work mode",
      workAsClient: "Work as client",
      workAsFreelancer: "Work as freelancer",
      adminCabinet: "Admin cabinet",
      signOut: "Sign out",
    },
    review: {
      backToModeration: "← Back to moderation",
      moderationReview: "Moderation review",
      adminCanWriteHint:
        "Admins can write in chat on their own behalf — participants will see messages marked “Administrator”",
      projectChatTitle: "Project chat",
      bidChatTitle: "Bid chat",
      clientFallback: "Client",
      freelancerFallback: "Freelancer",
      emptyThread:
        "No messages in this thread yet. You can write first as administrator.",
      blockedText: "Blocked text",
      participant: "Participant",
      adminLabel: "Administrator",
      composerLabel: "Message from administrator",
      composerPlaceholder: "Write to participants as Taskery administrator…",
      composerHint:
        "The message will be visible to the client and freelancer with your name",
      sending: "Sending…",
      send: "Send",
    },
    attention: {
      dismiss: "Dismiss",
      dismissTitle: "Dismiss this alert for you only",
    },
    telegram: {
      title: "Admin Telegram",
      hint: "Private bot: moderation and finance alerts, actions via inline buttons.",
      connect: "Connect admin bot",
      linking: "Creating link…",
      openBot: "Open admin bot",
      connectHint: "Link expires in 15 minutes. Do not share it with others.",
      connected: "Admin bot connected",
      disconnect: "Disconnect",
      alertsToggle: "Moderation and finance alerts in Telegram",
      notConfigured: "Admin bot is not configured on the server (TELEGRAM_ADMIN_BOT_TOKEN)",
    },
    panels: ADMIN_PANELS_COPY.en,
  },
};

export function getAdminCopy(locale: AppLocale): AdminCopy {
  return ADMIN_COPY[locale] ?? ADMIN_COPY.ru;
}

export function localizeAdminTab(
  tab: AdminTabDefinition,
  locale: AppLocale,
): AdminTabDefinition {
  const copy = getAdminCopy(locale);
  return {
    ...tab,
    label: copy.tabs[tab.id].label,
    description: copy.tabs[tab.id].description,
  };
}
