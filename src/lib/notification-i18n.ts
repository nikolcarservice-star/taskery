import type { AppLocale } from "@/lib/i18n/types";

export type RoleFallbackKey =
  | "client"
  | "freelancer"
  | "participant"
  | "project"
  | "admin";

export type NotificationTemplateKey =
  | "PROJECT_MATCH"
  | "BID_ACCEPTED"
  | "NEW_BID"
  | "BID_MESSAGE"
  | "NEW_MESSAGE"
  | "PROJECT_MODERATION_PENDING"
  | "PROJECT_PUBLISHED"
  | "PROJECT_PUBLISHED_MODERATED"
  | "PROJECT_REJECTED"
  | "DISPUTE_OPENED"
  | "DISPUTE_REFUND_CLIENT_STRIPE"
  | "DISPUTE_REFUND_CLIENT_BALANCE"
  | "DISPUTE_SPLIT_CLIENT_STRIPE"
  | "DISPUTE_SPLIT_CLIENT_BALANCE"
  | "VERIFICATION_APPROVED"
  | "VERIFICATION_REJECTED"
  | "WITHDRAWAL_APPROVED_STRIPE"
  | "WITHDRAWAL_APPROVED_MANUAL"
  | "WITHDRAWAL_REJECTED"
  | "BALANCE_ADJUSTED_CREDIT"
  | "BALANCE_ADJUSTED_DEBIT"
  | "ADMIN_MESSAGE"
  | "ADMIN_BID_MESSAGE"
  | "SUPPORT_REPLY"
  | "SUPPORT_TICKET_CLOSED"
  | "SUPPORT_TICKET_RESOLVED"
  | "SANCTION_WARNING"
  | "SANCTION_TEMP_BAN"
  | "SANCTION_FINE"
  | "ADMIN_WITHDRAWAL_REQUEST"
  | "ADMIN_REPORT_PROJECT"
  | "ADMIN_REPORT_USER"
  | "ADMIN_PROJECT_PENDING"
  | "ADMIN_DISPUTE_OPENED";

type NotificationCopy = {
  title: string;
  body: string;
};

export const NOTIFICATION_ROLE_NAMES: Record<
  AppLocale,
  Record<RoleFallbackKey, string>
> = {
  ru: {
    client: "Заказчик",
    freelancer: "Фрилансер",
    participant: "Участник",
    project: "Проект",
    admin: "Администратор",
  },
  uk: {
    client: "Замовник",
    freelancer: "Фрілансер",
    participant: "Учасник",
    project: "Проєкт",
    admin: "Адміністратор",
  },
  pl: {
    client: "Klient",
    freelancer: "Freelancer",
    participant: "Uczestnik",
    project: "Projekt",
    admin: "Administrator",
  },
  en: {
    client: "Client",
    freelancer: "Freelancer",
    participant: "Participant",
    project: "Project",
    admin: "Administrator",
  },
};

export const NOTIFICATION_I18N: Record<
  AppLocale,
  Record<NotificationTemplateKey, NotificationCopy>
> = {
  ru: {
    PROJECT_MATCH: {
      title: "Новый проект в вашей категории",
      body: "{categoryName} · {projectTitle}",
    },
    BID_ACCEPTED: {
      title: "Вас выбрали исполнителем",
      body: "{clientName} · {projectTitle}",
    },
    NEW_BID: {
      title: "Новый отклик на проект",
      body: "{freelancerName} · {projectTitle}",
    },
    BID_MESSAGE: {
      title: "Новое сообщение по отклику",
      body: "{senderName} · {projectTitle}",
    },
    NEW_MESSAGE: {
      title: "Новое сообщение",
      body: "{senderName} · {projectTitle}",
    },
    PROJECT_MODERATION_PENDING: {
      title: "Проект на модерации",
      body: "«{projectTitle}» отправлен на проверку. Мы уведомим вас после публикации.",
    },
    PROJECT_PUBLISHED: {
      title: "Проект опубликован",
      body: "«{projectTitle}» опубликован и доступен в каталоге.",
    },
    PROJECT_PUBLISHED_MODERATED: {
      title: "Проект опубликован",
      body: "«{projectTitle}» прошёл модерацию и доступен в каталоге.",
    },
    PROJECT_REJECTED: {
      title: "Проект отклонён",
      body: "«{projectTitle}»: {reason}",
    },
    DISPUTE_OPENED: {
      title: "Открыт спор",
      body: "По проекту «{projectTitle}» открыт спор. Администрация рассмотрит обращение.",
    },
    DISPUTE_REFUND_CLIENT_STRIPE: {
      title: "Спор решён в вашу пользу",
      body: "Средства по проекту «{projectTitle}» возвращены на карту через Stripe.",
    },
    DISPUTE_REFUND_CLIENT_BALANCE: {
      title: "Спор решён в вашу пользу",
      body: "Средства по проекту «{projectTitle}» возвращены на баланс.",
    },
    DISPUTE_SPLIT_CLIENT_STRIPE: {
      title: "Спор решён частично",
      body: "Вам возвращено {amount} через Stripe по проекту «{projectTitle}».",
    },
    DISPUTE_SPLIT_CLIENT_BALANCE: {
      title: "Спор решён частично",
      body: "На баланс возвращено {amount} по проекту «{projectTitle}».",
    },
    VERIFICATION_APPROVED: {
      title: "Профиль верифицирован",
      body: "Администрация подтвердила ваш профиль. Значок верификации отображается на странице профиля.",
    },
    VERIFICATION_REJECTED: {
      title: "Верификация отклонена",
      body: "{reason}",
    },
    WITHDRAWAL_APPROVED_STRIPE: {
      title: "Вывод одобрен",
      body: "Заявка на {amount} одобрена. Средства отправлены через Stripe Connect.",
    },
    WITHDRAWAL_APPROVED_MANUAL: {
      title: "Вывод одобрен",
      body: "Заявка на {amount} одобрена. Средства будут переведены на указанные реквизиты в течение 1–3 рабочих дней.",
    },
    WITHDRAWAL_REJECTED: {
      title: "Вывод отклонён",
      body: "{reason}. Сумма возвращена на баланс.",
    },
    BALANCE_ADJUSTED_CREDIT: {
      title: "Баланс пополнен",
      body: "Администратор зачислил {amount}. {reason}",
    },
    BALANCE_ADJUSTED_DEBIT: {
      title: "Списание с баланса",
      body: "Администратор списал {amount}. {reason}",
    },
    ADMIN_MESSAGE: {
      title: "Сообщение от администратора",
      body: "{senderName} · {projectTitle}",
    },
    ADMIN_BID_MESSAGE: {
      title: "Сообщение от администратора",
      body: "{senderName} · {projectTitle}",
    },
    SUPPORT_REPLY: {
      title: "Ответ службы поддержки",
      body: "{ticketSubject}",
    },
    SUPPORT_TICKET_CLOSED: {
      title: "Обращение закрыто",
      body: "{ticketSubject}",
    },
    SUPPORT_TICKET_RESOLVED: {
      title: "Обращение решено",
      body: "{ticketSubject}",
    },
    SANCTION_WARNING: {
      title: "Предупреждение от администрации",
      body: "{reason}",
    },
    SANCTION_TEMP_BAN: {
      title: "Временная блокировка аккаунта",
      body: "Аккаунт заблокирован на {days} дн. Причина: {reason}",
    },
    SANCTION_FINE: {
      title: "Штраф от администрации",
      body: "С баланса списано {amount}. Причина: {reason}",
    },
    ADMIN_WITHDRAWAL_REQUEST: {
      title: "Новая заявка на вывод",
      body: "{amount}",
    },
    ADMIN_REPORT_PROJECT: {
      title: "Новая жалоба на проект",
      body: "{reason}",
    },
    ADMIN_REPORT_USER: {
      title: "Новая жалоба на пользователя",
      body: "{reason}",
    },
    ADMIN_PROJECT_PENDING: {
      title: "Проект на модерации",
      body: "{projectTitle}",
    },
    ADMIN_DISPUTE_OPENED: {
      title: "Открыт спор",
      body: "{projectTitle}",
    },
  },
  uk: {
    PROJECT_MATCH: {
      title: "Новий проєкт у вашій категорії",
      body: "{categoryName} · {projectTitle}",
    },
    BID_ACCEPTED: {
      title: "Вас обрано виконавцем",
      body: "{clientName} · {projectTitle}",
    },
    NEW_BID: {
      title: "Новий відгук на проєкт",
      body: "{freelancerName} · {projectTitle}",
    },
    BID_MESSAGE: {
      title: "Нове повідомлення щодо відгуку",
      body: "{senderName} · {projectTitle}",
    },
    NEW_MESSAGE: {
      title: "Нове повідомлення",
      body: "{senderName} · {projectTitle}",
    },
    PROJECT_MODERATION_PENDING: {
      title: "Проєкт на модерації",
      body: "«{projectTitle}» надіслано на перевірку. Ми повідомимо вас після публікації.",
    },
    PROJECT_PUBLISHED: {
      title: "Проєкт опубліковано",
      body: "«{projectTitle}» опубліковано та доступний у каталозі.",
    },
    PROJECT_PUBLISHED_MODERATED: {
      title: "Проєкт опубліковано",
      body: "«{projectTitle}» пройшов модерацію та доступний у каталозі.",
    },
    PROJECT_REJECTED: {
      title: "Проєкт відхилено",
      body: "«{projectTitle}»: {reason}",
    },
    DISPUTE_OPENED: {
      title: "Відкрито спір",
      body: "Щодо проєкту «{projectTitle}» відкрито спір. Адміністрація розгляне звернення.",
    },
    DISPUTE_REFUND_CLIENT_STRIPE: {
      title: "Спір вирішено на вашу користь",
      body: "Кошти за проєкт «{projectTitle}» повернено на картку через Stripe.",
    },
    DISPUTE_REFUND_CLIENT_BALANCE: {
      title: "Спір вирішено на вашу користь",
      body: "Кошти за проєкт «{projectTitle}» повернено на баланс.",
    },
    DISPUTE_SPLIT_CLIENT_STRIPE: {
      title: "Спір вирішено частково",
      body: "Вам повернено {amount} через Stripe за проєкт «{projectTitle}».",
    },
    DISPUTE_SPLIT_CLIENT_BALANCE: {
      title: "Спір вирішено частково",
      body: "На баланс повернено {amount} за проєкт «{projectTitle}».",
    },
    VERIFICATION_APPROVED: {
      title: "Профіль верифіковано",
      body: "Адміністрація підтвердила ваш профіль. Значок верифікації відображається на сторінці профілю.",
    },
    VERIFICATION_REJECTED: {
      title: "Верифікацію відхилено",
      body: "{reason}",
    },
    WITHDRAWAL_APPROVED_STRIPE: {
      title: "Виведення схвалено",
      body: "Заявку на {amount} схвалено. Кошти надіслано через Stripe Connect.",
    },
    WITHDRAWAL_APPROVED_MANUAL: {
      title: "Виведення схвалено",
      body: "Заявку на {amount} схвалено. Кошти буде переказано на вказані реквізити протягом 1–3 робочих днів.",
    },
    WITHDRAWAL_REJECTED: {
      title: "Виведення відхилено",
      body: "{reason}. Суму повернено на баланс.",
    },
    BALANCE_ADJUSTED_CREDIT: {
      title: "Баланс поповнено",
      body: "Адміністратор зарахував {amount}. {reason}",
    },
    BALANCE_ADJUSTED_DEBIT: {
      title: "Списання з балансу",
      body: "Адміністратор списав {amount}. {reason}",
    },
    ADMIN_MESSAGE: {
      title: "Повідомлення від адміністратора",
      body: "{senderName} · {projectTitle}",
    },
    ADMIN_BID_MESSAGE: {
      title: "Повідомлення від адміністратора",
      body: "{senderName} · {projectTitle}",
    },
    SUPPORT_REPLY: {
      title: "Відповідь служби підтримки",
      body: "{ticketSubject}",
    },
    SUPPORT_TICKET_CLOSED: {
      title: "Звернення закрито",
      body: "{ticketSubject}",
    },
    SUPPORT_TICKET_RESOLVED: {
      title: "Звернення вирішено",
      body: "{ticketSubject}",
    },
    SANCTION_WARNING: {
      title: "Попередження від адміністрації",
      body: "{reason}",
    },
    SANCTION_TEMP_BAN: {
      title: "Тимчасове блокування облікового запису",
      body: "Обліковий запис заблоковано на {days} дн. Причина: {reason}",
    },
    SANCTION_FINE: {
      title: "Штраф від адміністрації",
      body: "З балансу списано {amount}. Причина: {reason}",
    },
    ADMIN_WITHDRAWAL_REQUEST: {
      title: "Нова заявка на виведення",
      body: "{amount}",
    },
    ADMIN_REPORT_PROJECT: {
      title: "Нова скарга на проєкт",
      body: "{reason}",
    },
    ADMIN_REPORT_USER: {
      title: "Нова скарга на користувача",
      body: "{reason}",
    },
    ADMIN_PROJECT_PENDING: {
      title: "Проєкт на модерації",
      body: "{projectTitle}",
    },
    ADMIN_DISPUTE_OPENED: {
      title: "Відкрито спір",
      body: "{projectTitle}",
    },
  },
  pl: {
    PROJECT_MATCH: {
      title: "Nowy projekt w Twojej kategorii",
      body: "{categoryName} · {projectTitle}",
    },
    BID_ACCEPTED: {
      title: "Wybrano Cię jako wykonawcę",
      body: "{clientName} · {projectTitle}",
    },
    NEW_BID: {
      title: "Nowa oferta do projektu",
      body: "{freelancerName} · {projectTitle}",
    },
    BID_MESSAGE: {
      title: "Nowa wiadomość do oferty",
      body: "{senderName} · {projectTitle}",
    },
    NEW_MESSAGE: {
      title: "Nowa wiadomość",
      body: "{senderName} · {projectTitle}",
    },
    PROJECT_MODERATION_PENDING: {
      title: "Projekt w moderacji",
      body: "„{projectTitle}” został wysłany do weryfikacji. Powiadomimy Cię po publikacji.",
    },
    PROJECT_PUBLISHED: {
      title: "Projekt opublikowany",
      body: "„{projectTitle}” został opublikowany i jest dostępny w katalogu.",
    },
    PROJECT_PUBLISHED_MODERATED: {
      title: "Projekt opublikowany",
      body: "„{projectTitle}” przeszedł moderację i jest dostępny w katalogu.",
    },
    PROJECT_REJECTED: {
      title: "Projekt odrzucony",
      body: "„{projectTitle}”: {reason}",
    },
    DISPUTE_OPENED: {
      title: "Otwarto spór",
      body: "W sprawie projektu „{projectTitle}” otwarto spór. Administracja rozpatrzy zgłoszenie.",
    },
    DISPUTE_REFUND_CLIENT_STRIPE: {
      title: "Spór rozstrzygnięty na Twoją korzyść",
      body: "Środki za projekt „{projectTitle}” zwrócono na kartę przez Stripe.",
    },
    DISPUTE_REFUND_CLIENT_BALANCE: {
      title: "Spór rozstrzygnięty na Twoją korzyść",
      body: "Środki za projekt „{projectTitle}” zwrócono na saldo.",
    },
    DISPUTE_SPLIT_CLIENT_STRIPE: {
      title: "Spór częściowo rozstrzygnięty",
      body: "Zwrócono Ci {amount} przez Stripe za projekt „{projectTitle}”.",
    },
    DISPUTE_SPLIT_CLIENT_BALANCE: {
      title: "Spór częściowo rozstrzygnięty",
      body: "Na saldo zwrócono {amount} za projekt „{projectTitle}”.",
    },
    VERIFICATION_APPROVED: {
      title: "Profil zweryfikowany",
      body: "Administracja potwierdziła Twój profil. Odznaka weryfikacji jest widoczna na stronie profilu.",
    },
    VERIFICATION_REJECTED: {
      title: "Weryfikacja odrzucona",
      body: "{reason}",
    },
    WITHDRAWAL_APPROVED_STRIPE: {
      title: "Wypłata zatwierdzona",
      body: "Wniosek o {amount} został zatwierdzony. Środki wysłano przez Stripe Connect.",
    },
    WITHDRAWAL_APPROVED_MANUAL: {
      title: "Wypłata zatwierdzona",
      body: "Wniosek o {amount} został zatwierdzony. Środki zostaną przelane na podane dane w ciągu 1–3 dni roboczych.",
    },
    WITHDRAWAL_REJECTED: {
      title: "Wypłata odrzucona",
      body: "{reason}. Kwota została zwrócona na saldo.",
    },
    BALANCE_ADJUSTED_CREDIT: {
      title: "Saldo zasilone",
      body: "Administrator zaksięgował {amount}. {reason}",
    },
    BALANCE_ADJUSTED_DEBIT: {
      title: "Obciążenie salda",
      body: "Administrator obciążył saldo o {amount}. {reason}",
    },
    ADMIN_MESSAGE: {
      title: "Wiadomość od administratora",
      body: "{senderName} · {projectTitle}",
    },
    ADMIN_BID_MESSAGE: {
      title: "Wiadomość od administratora",
      body: "{senderName} · {projectTitle}",
    },
    SUPPORT_REPLY: {
      title: "Odpowiedź obsługi klienta",
      body: "{ticketSubject}",
    },
    SUPPORT_TICKET_CLOSED: {
      title: "Zgłoszenie zamknięte",
      body: "{ticketSubject}",
    },
    SUPPORT_TICKET_RESOLVED: {
      title: "Zgłoszenie rozwiązane",
      body: "{ticketSubject}",
    },
    SANCTION_WARNING: {
      title: "Ostrzeżenie od administracji",
      body: "{reason}",
    },
    SANCTION_TEMP_BAN: {
      title: "Tymczasowa blokada konta",
      body: "Konto zablokowane na {days} dni. Powód: {reason}",
    },
    SANCTION_FINE: {
      title: "Kara od administracji",
      body: "Z salda pobrano {amount}. Powód: {reason}",
    },
    ADMIN_WITHDRAWAL_REQUEST: {
      title: "Nowy wniosek o wypłatę",
      body: "{amount}",
    },
    ADMIN_REPORT_PROJECT: {
      title: "Nowe zgłoszenie projektu",
      body: "{reason}",
    },
    ADMIN_REPORT_USER: {
      title: "Nowe zgłoszenie użytkownika",
      body: "{reason}",
    },
    ADMIN_PROJECT_PENDING: {
      title: "Projekt w moderacji",
      body: "{projectTitle}",
    },
    ADMIN_DISPUTE_OPENED: {
      title: "Otwarty spór",
      body: "{projectTitle}",
    },
  },
  en: {
    PROJECT_MATCH: {
      title: "New project in your category",
      body: "{categoryName} · {projectTitle}",
    },
    BID_ACCEPTED: {
      title: "You were selected as the freelancer",
      body: "{clientName} · {projectTitle}",
    },
    NEW_BID: {
      title: "New bid on your project",
      body: "{freelancerName} · {projectTitle}",
    },
    BID_MESSAGE: {
      title: "New bid message",
      body: "{senderName} · {projectTitle}",
    },
    NEW_MESSAGE: {
      title: "New message",
      body: "{senderName} · {projectTitle}",
    },
    PROJECT_MODERATION_PENDING: {
      title: "Project under moderation",
      body: '"{projectTitle}" was submitted for review. We will notify you after publication.',
    },
    PROJECT_PUBLISHED: {
      title: "Project published",
      body: '"{projectTitle}" is published and available in the catalog.',
    },
    PROJECT_PUBLISHED_MODERATED: {
      title: "Project published",
      body: '"{projectTitle}" passed moderation and is available in the catalog.',
    },
    PROJECT_REJECTED: {
      title: "Project rejected",
      body: '"{projectTitle}": {reason}',
    },
    DISPUTE_OPENED: {
      title: "Dispute opened",
      body: 'A dispute was opened for project "{projectTitle}". The team will review it.',
    },
    DISPUTE_REFUND_CLIENT_STRIPE: {
      title: "Dispute resolved in your favor",
      body: 'Funds for project "{projectTitle}" were refunded to your card via Stripe.',
    },
    DISPUTE_REFUND_CLIENT_BALANCE: {
      title: "Dispute resolved in your favor",
      body: 'Funds for project "{projectTitle}" were refunded to your balance.',
    },
    DISPUTE_SPLIT_CLIENT_STRIPE: {
      title: "Dispute partially resolved",
      body: '{amount} was refunded via Stripe for project "{projectTitle}".',
    },
    DISPUTE_SPLIT_CLIENT_BALANCE: {
      title: "Dispute partially resolved",
      body: '{amount} was refunded to your balance for project "{projectTitle}".',
    },
    VERIFICATION_APPROVED: {
      title: "Profile verified",
      body: "Your profile was approved. The verification badge is shown on your profile page.",
    },
    VERIFICATION_REJECTED: {
      title: "Verification rejected",
      body: "{reason}",
    },
    WITHDRAWAL_APPROVED_STRIPE: {
      title: "Withdrawal approved",
      body: "Your {amount} withdrawal was approved. Funds were sent via Stripe Connect.",
    },
    WITHDRAWAL_APPROVED_MANUAL: {
      title: "Withdrawal approved",
      body: "Your {amount} withdrawal was approved. Funds will be transferred within 1–3 business days.",
    },
    WITHDRAWAL_REJECTED: {
      title: "Withdrawal rejected",
      body: "{reason}. The amount was returned to your balance.",
    },
    BALANCE_ADJUSTED_CREDIT: {
      title: "Balance credited",
      body: "An administrator credited {amount}. {reason}",
    },
    BALANCE_ADJUSTED_DEBIT: {
      title: "Balance debited",
      body: "An administrator debited {amount}. {reason}",
    },
    ADMIN_MESSAGE: {
      title: "Message from administrator",
      body: "{senderName} · {projectTitle}",
    },
    ADMIN_BID_MESSAGE: {
      title: "Message from administrator",
      body: "{senderName} · {projectTitle}",
    },
    SUPPORT_REPLY: {
      title: "Support reply",
      body: "{ticketSubject}",
    },
    SUPPORT_TICKET_CLOSED: {
      title: "Ticket closed",
      body: "{ticketSubject}",
    },
    SUPPORT_TICKET_RESOLVED: {
      title: "Ticket resolved",
      body: "{ticketSubject}",
    },
    SANCTION_WARNING: {
      title: "Warning from administration",
      body: "{reason}",
    },
    SANCTION_TEMP_BAN: {
      title: "Temporary account suspension",
      body: "Your account is suspended for {days} days. Reason: {reason}",
    },
    SANCTION_FINE: {
      title: "Fine from administration",
      body: "{amount} was deducted from your balance. Reason: {reason}",
    },
    ADMIN_WITHDRAWAL_REQUEST: {
      title: "New withdrawal request",
      body: "{amount}",
    },
    ADMIN_REPORT_PROJECT: {
      title: "New project report",
      body: "{reason}",
    },
    ADMIN_REPORT_USER: {
      title: "New user report",
      body: "{reason}",
    },
    ADMIN_PROJECT_PENDING: {
      title: "Project pending moderation",
      body: "{projectTitle}",
    },
    ADMIN_DISPUTE_OPENED: {
      title: "Dispute opened",
      body: "{projectTitle}",
    },
  },
};

export function fillNotificationTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}

export function getRoleFallbackName(
  locale: AppLocale,
  role: RoleFallbackKey,
): string {
  return NOTIFICATION_ROLE_NAMES[locale][role];
}

export function buildNotification(
  locale: AppLocale,
  key: NotificationTemplateKey,
  vars: Record<string, string> = {},
): NotificationCopy {
  const template = NOTIFICATION_I18N[locale][key];
  return {
    title: fillNotificationTemplate(template.title, vars),
    body: fillNotificationTemplate(template.body, vars),
  };
}
