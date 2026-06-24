import type { AdminTabDefinition, AdminTabKey, ModerationSectionKey } from "@/lib/admin-tabs";
import type { AppLocale } from "@/lib/i18n/types";

type AdminCopy = {
  panelTitle: string;
  sections: string;
  navAria: string;
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
};

const ADMIN_COPY: Record<AppLocale, AdminCopy> = {
  ru: {
    panelTitle: "Админ-панель",
    sections: "Разделы",
    navAria: "Навигация админ-панели",
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
  },
  uk: {
    panelTitle: "Адмін-панель",
    sections: "Розділи",
    navAria: "Навігація адмін-панелі",
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
  },
  pl: {
    panelTitle: "Panel admina",
    sections: "Sekcje",
    navAria: "Nawigacja panelu admina",
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
  },
  en: {
    panelTitle: "Admin panel",
    sections: "Sections",
    navAria: "Admin panel navigation",
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
