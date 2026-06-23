/**
 * Add reports i18n to all locale files.
 * Run: node scripts/sync-reports-i18n.js
 */
const fs = require("fs");
const path = require("path");

const messagesDir = path.join(__dirname, "..", "src", "messages");

const reportsRu = {
  reportProject: "Пожаловаться на проект",
  reportUser: "Пожаловаться на пользователя",
  reportShort: "Жалоба",
  alreadyReported: "Вы уже отправили жалобу",
  alreadyReportedShort: "Отправлено",
  loginToReport: "Войти, чтобы пожаловаться",
  dialogHint: "Жалоба будет рассмотрена модератором. Злоупотребление жалобами может привести к ограничениям.",
  reasonLabel: "Причина",
  detailsLabel: "Подробности",
  detailsPlaceholder: "Опишите проблему (обязательно для «Другое»)",
  submit: "Отправить жалобу",
  submitting: "Отправка…",
  success: "Жалоба отправлена. Спасибо!",
  ownerHiddenNotice: "Проект скрыт из каталога из‑за жалоб и ожидает проверки модератором.",
  ownerReportsNotice: "На проект поступило жалоб: {count}.",
  bar: {
    underpriced: "{count} из {threshold} жалоб на заниженную цену",
    hot: "Проект на проверке модерацией",
    totalReports: "Всего жалоб: {count}",
  },
  flag: {
    warning: "Есть жалобы на проект",
    hot: "Много жалоб — на проверке",
  },
  reasons: {
    UNDERPRICED: "Заниженная цена",
    SPAM: "Спам",
    FRAUD: "Мошенничество",
    HARASSMENT: "Оскорбления / домогательства",
    IRRELEVANT: "Нерелевантное задание",
    POLICY_VIOLATION: "Нарушение правил",
    FAKE_PROFILE: "Фейковый профиль",
    OTHER: "Другое",
  },
};

const reportsEn = {
  reportProject: "Report project",
  reportUser: "Report user",
  reportShort: "Report",
  alreadyReported: "You have already submitted a report",
  alreadyReportedShort: "Submitted",
  loginToReport: "Sign in to report",
  dialogHint: "A moderator will review your report. Abuse may lead to restrictions.",
  reasonLabel: "Reason",
  detailsLabel: "Details",
  detailsPlaceholder: "Describe the issue (required for Other)",
  submit: "Submit report",
  submitting: "Submitting…",
  success: "Report submitted. Thank you!",
  ownerHiddenNotice: "This project is hidden from the catalog due to reports and awaits moderation.",
  ownerReportsNotice: "Reports received: {count}.",
  bar: {
    underpriced: "{count} of {threshold} underpriced reports",
    hot: "Project under moderation review",
    totalReports: "Total reports: {count}",
  },
  flag: {
    warning: "Project has reports",
    hot: "Many reports — under review",
  },
  reasons: {
    UNDERPRICED: "Underpriced",
    SPAM: "Spam",
    FRAUD: "Fraud",
    HARASSMENT: "Harassment",
    IRRELEVANT: "Irrelevant task",
    POLICY_VIOLATION: "Policy violation",
    FAKE_PROFILE: "Fake profile",
    OTHER: "Other",
  },
};

const reportsUk = {
  reportProject: "Поскаржитися на проєкт",
  reportUser: "Поскаржитися на користувача",
  reportShort: "Скарга",
  alreadyReported: "Ви вже надіслали скаргу",
  alreadyReportedShort: "Надіслано",
  loginToReport: "Увійти, щоб поскаржитися",
  dialogHint: "Скаргу розгляне модератор. Зловживання скаргами може призвести до обмежень.",
  reasonLabel: "Причина",
  detailsLabel: "Деталі",
  detailsPlaceholder: "Опишіть проблему (обовʼязково для «Інше»)",
  submit: "Надіслати скаргу",
  submitting: "Надсилання…",
  success: "Скаргу надіслано. Дякуємо!",
  ownerHiddenNotice: "Проєкт приховано з каталогу через скарги та очікує перевірки модератором.",
  ownerReportsNotice: "На проєкт надійшло скарг: {count}.",
  bar: {
    underpriced: "{count} з {threshold} скарг на занижену ціну",
    hot: "Проєкт на перевірці модерацією",
    totalReports: "Усього скарг: {count}",
  },
  flag: {
    warning: "Є скарги на проєкт",
    hot: "Багато скарг — на перевірці",
  },
  reasons: {
    UNDERPRICED: "Занижена ціна",
    SPAM: "Спам",
    FRAUD: "Шахрайство",
    HARASSMENT: "Образи / домагання",
    IRRELEVANT: "Нерелевантне завдання",
    POLICY_VIOLATION: "Порушення правил",
    FAKE_PROFILE: "Фейковий профіль",
    OTHER: "Інше",
  },
};

const reportsPl = {
  reportProject: "Zgłoś projekt",
  reportUser: "Zgłoś użytkownika",
  reportShort: "Zgłoś",
  alreadyReported: "Zgłoszenie zostało już wysłane",
  alreadyReportedShort: "Wysłano",
  loginToReport: "Zaloguj się, aby zgłosić",
  dialogHint: "Moderator rozpatrzy zgłoszenie. Nadużywanie zgłoszeń może skutkować ograniczeniami.",
  reasonLabel: "Powód",
  detailsLabel: "Szczegóły",
  detailsPlaceholder: "Opisz problem (wymagane dla Inne)",
  submit: "Wyślij zgłoszenie",
  submitting: "Wysyłanie…",
  success: "Zgłoszenie wysłane. Dziękujemy!",
  ownerHiddenNotice: "Projekt ukryty w katalogu z powodu zgłoszeń i oczekuje na moderację.",
  ownerReportsNotice: "Otrzymano zgłoszeń: {count}.",
  bar: {
    underpriced: "{count} z {threshold} zgłoszeń o zaniżonej cenie",
    hot: "Projekt weryfikowany przez moderację",
    totalReports: "Łącznie zgłoszeń: {count}",
  },
  flag: {
    warning: "Projekt ma zgłoszenia",
    hot: "Wiele zgłoszeń — weryfikacja",
  },
  reasons: {
    UNDERPRICED: "Zaniżona cena",
    SPAM: "Spam",
    FRAUD: "Oszustwo",
    HARASSMENT: "Nękanie",
    IRRELEVANT: "Nierelewantne zadanie",
    POLICY_VIOLATION: "Naruszenie zasad",
    FAKE_PROFILE: "Fałszywy profil",
    OTHER: "Inne",
  },
};

const actionErrorPatch = {
  ru: {
    REPORT_REASON_REQUIRED: "Выберите причину жалобы",
    REPORT_DETAILS_REQUIRED: "Опишите проблему (минимум 10 символов)",
    REPORT_ALREADY_SUBMITTED: "Вы уже отправили жалобу",
    CANNOT_REPORT_SELF: "Нельзя пожаловаться на себя или свой проект",
    ACCOUNT_BANNED: "Аккаунт заблокирован",
  },
  en: {
    REPORT_REASON_REQUIRED: "Select a report reason",
    REPORT_DETAILS_REQUIRED: "Describe the issue (at least 10 characters)",
    REPORT_ALREADY_SUBMITTED: "You have already submitted a report",
    CANNOT_REPORT_SELF: "You cannot report yourself or your own project",
    ACCOUNT_BANNED: "Account is banned",
  },
  uk: {
    REPORT_REASON_REQUIRED: "Оберіть причину скарги",
    REPORT_DETAILS_REQUIRED: "Опишіть проблему (мінімум 10 символів)",
    REPORT_ALREADY_SUBMITTED: "Ви вже надіслали скаргу",
    CANNOT_REPORT_SELF: "Не можна скаржитися на себе або власний проєкт",
    ACCOUNT_BANNED: "Акаунт заблоковано",
  },
  pl: {
    REPORT_REASON_REQUIRED: "Wybierz powód zgłoszenia",
    REPORT_DETAILS_REQUIRED: "Opisz problem (minimum 10 znaków)",
    REPORT_ALREADY_SUBMITTED: "Zgłoszenie zostało już wysłane",
    CANNOT_REPORT_SELF: "Nie można zgłaszać siebie ani własnego projektu",
    ACCOUNT_BANNED: "Konto jest zablokowane",
  },
};

const reportsByLocale = { ru: reportsRu, en: reportsEn, uk: reportsUk, pl: reportsPl };

for (const [locale, reports] of Object.entries(reportsByLocale)) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  data.reports = reports;
  data.actionErrors = { ...data.actionErrors, ...actionErrorPatch[locale] };
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
  console.log("Updated", locale);
}

console.log("Done.");
