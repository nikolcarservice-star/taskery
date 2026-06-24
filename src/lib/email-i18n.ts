import type { AppLocale } from "@/lib/i18n/types";

export type EmailTemplates = {
  passwordResetSubject: string;
  passwordResetHeading: string;
  passwordResetIntro: string;
  passwordResetCta: string;
  passwordResetExpiry: string;
  welcomeSubject: string;
  welcomeHeadingNamed: string;
  welcomeHeading: string;
  welcomeIntro: string;
  welcomeCta: string;
  bidSubject: string;
  bidBody: string;
  bidCta: string;
  messageSubject: string;
  bidMessageSubject: string;
  messageBody: string;
  messageCta: string;
  messageFooter: string;
  projectMatchSubject: string;
  projectMatchBody: string;
  projectMatchCta: string;
  projectMatchFooter: string;
};

const copy: Record<AppLocale, EmailTemplates> = {
  ru: {
    passwordResetSubject: "Сброс пароля — {siteName}",
    passwordResetHeading: "Сброс пароля",
    passwordResetIntro: "Вы запросили сброс пароля на {siteName}.",
    passwordResetCta: "Нажмите здесь, чтобы задать новый пароль",
    passwordResetExpiry:
      "Ссылка действительна 1 час. Если вы не запрашивали сброс — проигнорируйте письмо.",
    welcomeSubject: "Добро пожаловать в {siteName}!",
    welcomeHeadingNamed: "Добро пожаловать, {name}!",
    welcomeHeading: "Добро пожаловать!",
    welcomeIntro: "Ваш аккаунт на {siteName} успешно создан.",
    welcomeCta: "Перейти на платформу",
    bidSubject: "Новый отклик на проект «{projectTitle}»",
    bidBody: "На ваш проект «{projectTitle}» поступил новый отклик.",
    bidCta: "Посмотреть отклики",
    messageSubject: "Новое сообщение — {projectTitle}",
    bidMessageSubject: "Новое сообщение по отклику — {projectTitle}",
    messageBody: "<strong>{senderName}</strong> написал вам по проекту «{projectTitle}»:",
    messageCta: "Открыть переписку",
    messageFooter:
      "Вы получили это письмо, потому что включили уведомления о новых сообщениях в настройках {siteName}.",
    projectMatchSubject: "Новый проект в категории «{categoryName}»",
    projectMatchBody:
      "Опубликован проект «{projectTitle}» в категории «{categoryName}».",
    projectMatchCta: "Посмотреть проект",
    projectMatchFooter:
      "Вы получили это письмо, потому что включили дайджест новых проектов в настройках {siteName}.",
  },
  uk: {
    passwordResetSubject: "Скидання пароля — {siteName}",
    passwordResetHeading: "Скидання пароля",
    passwordResetIntro: "Ви запросили скидання пароля на {siteName}.",
    passwordResetCta: "Натисніть тут, щоб задати новий пароль",
    passwordResetExpiry:
      "Посилання дійсне 1 годину. Якщо ви не запитували скидання — проігноруйте цей лист.",
    welcomeSubject: "Ласкаво просимо до {siteName}!",
    welcomeHeadingNamed: "Ласкаво просимо, {name}!",
    welcomeHeading: "Ласкаво просимо!",
    welcomeIntro: "Ваш обліковий запис на {siteName} успішно створено.",
    welcomeCta: "Перейти на платформу",
    bidSubject: "Новий відгук на проєкт «{projectTitle}»",
    bidBody: "На ваш проєкт «{projectTitle}» надійшов новий відгук.",
    bidCta: "Переглянути відгуки",
    messageSubject: "Нове повідомлення — {projectTitle}",
    bidMessageSubject: "Нове повідомлення щодо відгуку — {projectTitle}",
    messageBody:
      "<strong>{senderName}</strong> написав вам щодо проєкту «{projectTitle}»:",
    messageCta: "Відкрити переписку",
    messageFooter:
      "Ви отримали цей лист, бо увімкнули сповіщення про нові повідомлення в налаштуваннях {siteName}.",
    projectMatchSubject: "Новий проєкт у категорії «{categoryName}»",
    projectMatchBody:
      "Опубліковано проєкт «{projectTitle}» у категорії «{categoryName}».",
    projectMatchCta: "Переглянути проєкт",
    projectMatchFooter:
      "Ви отримали цей лист, бо увімкнули дайджест нових проєктів у налаштуваннях {siteName}.",
  },
  pl: {
    passwordResetSubject: "Reset hasła — {siteName}",
    passwordResetHeading: "Reset hasła",
    passwordResetIntro: "Poprosiłeś o reset hasła w {siteName}.",
    passwordResetCta: "Kliknij tutaj, aby ustawić nowe hasło",
    passwordResetExpiry:
      "Link jest ważny przez 1 godzinę. Jeśli nie prosiłeś o reset — zignoruj tę wiadomość.",
    welcomeSubject: "Witamy w {siteName}!",
    welcomeHeadingNamed: "Witamy, {name}!",
    welcomeHeading: "Witamy!",
    welcomeIntro: "Twoje konto w {siteName} zostało utworzone.",
    welcomeCta: "Przejdź na platformę",
    bidSubject: "Nowa oferta do projektu „{projectTitle}”",
    bidBody: "Do Twojego projektu „{projectTitle}” wpłynęła nowa oferta.",
    bidCta: "Zobacz oferty",
    messageSubject: "Nowa wiadomość — {projectTitle}",
    bidMessageSubject: "Nowa wiadomość do oferty — {projectTitle}",
    messageBody:
      "<strong>{senderName}</strong> napisał do Ciebie w sprawie projektu „{projectTitle}”:",
    messageCta: "Otwórz rozmowę",
    messageFooter:
      "Otrzymałeś tę wiadomość, ponieważ włączyłeś powiadomienia o nowych wiadomościach w ustawieniach {siteName}.",
    projectMatchSubject: "Nowy projekt w kategorii „{categoryName}”",
    projectMatchBody:
      "Opublikowano projekt „{projectTitle}” w kategorii „{categoryName}”.",
    projectMatchCta: "Zobacz projekt",
    projectMatchFooter:
      "Otrzymałeś tę wiadomość, ponieważ włączyłeś digest nowych projektów w ustawieniach {siteName}.",
  },
  en: {
    passwordResetSubject: "Password reset — {siteName}",
    passwordResetHeading: "Password reset",
    passwordResetIntro: "You requested a password reset on {siteName}.",
    passwordResetCta: "Click here to set a new password",
    passwordResetExpiry:
      "This link expires in 1 hour. If you did not request a reset, ignore this email.",
    welcomeSubject: "Welcome to {siteName}!",
    welcomeHeadingNamed: "Welcome, {name}!",
    welcomeHeading: "Welcome!",
    welcomeIntro: "Your {siteName} account has been created.",
    welcomeCta: "Go to the platform",
    bidSubject: 'New bid on project "{projectTitle}"',
    bidBody: 'A new bid was submitted on your project "{projectTitle}".',
    bidCta: "View bids",
    messageSubject: "New message — {projectTitle}",
    bidMessageSubject: "New bid message — {projectTitle}",
    messageBody:
      '<strong>{senderName}</strong> wrote to you about "{projectTitle}":',
    messageCta: "Open conversation",
    messageFooter:
      "You received this email because you enabled new message notifications in {siteName} settings.",
    projectMatchSubject: 'New project in category "{categoryName}"',
    projectMatchBody:
      'Project "{projectTitle}" was published in category "{categoryName}".',
    projectMatchCta: "View project",
    projectMatchFooter:
      "You received this email because you enabled the new project digest in {siteName} settings.",
  },
};

export function getEmailTemplates(locale: AppLocale): EmailTemplates {
  return copy[locale];
}

export function fillEmailTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}
