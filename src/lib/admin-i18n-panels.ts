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
    viewProject: string;
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
  chrome: {
    workAsClient: string;
    workAsFreelancer: string;
    profileMenuAria: string;
    adminFallback: string;
    superAdminRole: string;
    myCabinet: string;
    adminPanel: string;
    messages: string;
    personalData: string;
    settings: string;
    signOut: string;
  };
  cabinetHome: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    description: string;
    panelTitle: string;
    panelDescription: string;
    asClient: string;
    asClientDesc: string;
    asFreelancer: string;
    asFreelancerDesc: string;
    messages: string;
    messagesDesc: string;
    finances: string;
    financesDesc: string;
  };
  users: {
    title: string;
    description: string;
    exportCsv: string;
    searchPlaceholder: string;
    roleAll: string;
    roleClients: string;
    roleFreelancers: string;
    statusAll: string;
    statusActive: string;
    statusBanned: string;
    statusDeleted: string;
    search: string;
    notFound: string;
    noName: string;
    accountDeleted: string;
    unban: string;
    ban: string;
    delete: string;
    deleteReason: string;
    badgeDeleted: string;
    badgeTempBan: string;
    badgeBanned: string;
    badgeActive: string;
    colUser: string;
    colRole: string;
    colBalance: string;
    colActivity: string;
    colStatus: string;
    colActions: string;
    projects: string;
    contracts: string;
    rating: string;
    memberSince: string;
    roles: Record<string, string>;
    sanctions: {
      hide: string;
      show: string;
      warningsShort: string;
      warnPlaceholder: string;
      warn: string;
      daysTitle: string;
      tempBanReason: string;
      tempBan: string;
      fineAmount: string;
      fineReason: string;
      fine: string;
    };
  };
  verification: {
    title: string;
    subtitle: string;
    inQueue: string;
    empty: string;
    rejectReason: string;
    approve: string;
    approved: string;
    noName: string;
    projects: string;
    skills: string;
  };
  cms: {
    title: string;
    urlHint: string;
    pageLabel: string;
    languageLabel: string;
    titleLabel: string;
    bodyLabel: string;
    saving: string;
    save: string;
    saved: string;
    slugs: Record<string, string>;
  };
  finance: {
    title: string;
    description: string;
    statUserBalances: string;
    statUserBalancesHint: string;
    statEscrow: string;
    activeDeals: string;
    turnover: string;
    statCommissions: string;
    statTopups: string;
    paymentsTotal: string;
    activeContractsTitle: string;
    noActiveEscrow: string;
    commission: string;
    clientLabel: string;
    freelancerLabel: string;
    recentPaymentsTitle: string;
    noPayments: string;
    colUser: string;
    colType: string;
    colAmount: string;
    colStatus: string;
    colDate: string;
    paymentTypes: Record<string, string>;
    paymentStatuses: Record<string, string>;
    contractStatuses: Record<string, string>;
    balanceAdjust: {
      title: string;
      description: string;
      userIdLabel: string;
      userIdPlaceholder: string;
      amountLabel: string;
      amountPlaceholder: string;
      reasonLabel: string;
      reasonPlaceholder: string;
      applying: string;
      apply: string;
      success: string;
    };
  };
  withdrawals: {
    title: string;
    description: string;
    inQueue: string;
    totalAmount: string;
    empty: string;
    approve: string;
    approved: string;
    rejectReason: string;
    rejectAndRefund: string;
    balance: string;
  };
  catalog: {
    title: string;
    description: string;
    categories: string;
    skills: string;
    nameLabel: string;
    descriptionLabel: string;
    saving: string;
    save: string;
    addCategory: string;
    saved: string;
    minBudgetTitle: string;
    minBudgetHint: string;
    noCategory: string;
    addSkill: string;
    categoryLabel: string;
    skillsCount: string;
    projectsCount: string;
    freelancersShort: string;
  };
  broadcast: {
    title: string;
    description: string;
    audience: string;
    audienceAll: string;
    audienceAllHint: string;
    audienceFreelancers: string;
    audienceFreelancersHint: string;
    audienceClients: string;
    audienceClientsHint: string;
    titleLabel: string;
    titlePlaceholder: string;
    bodyLabel: string;
    bodyPlaceholder: string;
    linkLabel: string;
    linkPlaceholder: string;
    linkHint: string;
    confirmCheckbox: string;
    send: string;
    sending: string;
    sentSuccess: string;
    recipientsSuffix: string;
  };
  analytics: {
    title: string;
    description: string;
    exportCsv: string;
    periodDays: string;
    daysShort: string;
    newUsers: string;
    newProjects: string;
    gmvReleased: string;
    platformCommissions: string;
    openDisputes: string;
    pendingReports: string;
    pendingWithdrawals: string;
    activeEscrow: string;
    chartSignups: string;
    chartProjects: string;
    chartGmv: string;
  };
  audit: {
    title: string;
    description: string;
    exportCsv: string;
    empty: string;
    target: string;
    actions: Record<string, string>;
  };
  staff: {
    title: string;
    description: string;
    addAdmin: string;
    newAdminTitle: string;
    name: string;
    email: string;
    password: string;
    namePlaceholder: string;
    passwordMinPlaceholder: string;
    newPassword: string;
    passwordKeepEmpty: string;
    functions: string;
    adminAdded: string;
    saving: string;
    create: string;
    cancel: string;
    edit: string;
    changesSaved: string;
    save: string;
    close: string;
    deactivate: string;
    deactivated: string;
    reactivate: string;
    reactivating: string;
    restored: string;
    deleteConfirm: string;
    deleteForever: string;
    deleting: string;
    deleted: string;
    noName: string;
    you: string;
    deactivatedBadge: string;
    fullAccess: string;
    permissions: Record<string, { label: string; description: string }>;
  };
  login: {
    badge: string;
    title: string;
    description: string;
    emailLabel: string;
    passwordLabel: string;
    totpLabel: string;
    errorInvalid: string;
    signingIn: string;
    submit: string;
    backToSite: string;
    devAccount: string;
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

const FINANCE_PAYMENT_TYPES_RU: Record<string, string> = {
  BALANCE_TOPUP: "Пополнение",
  SUBSCRIPTION: "Подписка",
  FEATURE_PROJECT: "Продвижение проекта",
  FEATURE_PROFILE: "Продвижение профиля",
  COMMISSION: "Комиссия",
  ADMIN_ADJUSTMENT: "Корректировка",
  FINE: "Штраф",
  WITHDRAWAL: "Вывод",
};

const FINANCE_PAYMENT_STATUSES_RU: Record<string, string> = {
  PENDING: "Ожидает",
  COMPLETED: "Завершён",
  FAILED: "Ошибка",
  REFUNDED: "Возврат",
};

const FINANCE_CONTRACT_STATUSES_RU: Record<string, string> = {
  AWAITING_FUNDING: "Ожидает внесения средств",
  ESCROWED: "Средства в эскроу",
  RELEASED: "Выплачено исполнителю",
  REFUNDED: "Возвращено заказчику",
};

const AUDIT_ACTIONS_RU: Record<string, string> = {
  DISPUTE_RELEASE: "Спор: выплата исполнителю",
  DISPUTE_REFUND: "Спор: возврат заказчику",
  DISPUTE_SPLIT: "Спор: частичное решение",
  PROJECT_CLOSE: "Проект закрыт",
  PROJECT_BLOCK: "Проект заблокирован",
  USER_BAN: "Пользователь заблокирован",
  USER_UNBAN: "Пользователь разблокирован",
  USER_DELETE: "Пользователь удалён",
  REPORT_DISMISS: "Жалобы отклонены",
  REPORT_RESOLVE: "Жалобы решены",
  REPORT_IN_REVIEW: "Жалоба взята в работу",
  STAFF_CREATE: "Админ добавлен",
  STAFF_UPDATE: "Админ изменён",
  STAFF_DEACTIVATE: "Админ деактивирован",
  STAFF_REACTIVATE: "Админ восстановлен",
  STAFF_DELETE: "Админ удалён",
  USER_WARNING: "Предупреждение пользователю",
  USER_TEMP_BAN: "Временная блокировка",
  USER_FINE: "Штраф пользователю",
  BALANCE_ADJUST: "Корректировка баланса",
  TICKET_REPLY: "Ответ в поддержке",
  TICKET_CLOSE: "Обращение закрыто",
  VERIFICATION_APPROVE: "Верификация одобрена",
  VERIFICATION_REJECT: "Верификация отклонена",
  CATALOG_CATEGORY_SAVE: "Категория сохранена",
  CATALOG_SKILL_SAVE: "Навык сохранён",
  WITHDRAWAL_APPROVE: "Вывод одобрен",
  WITHDRAWAL_REJECT: "Вывод отклонён",
  BROADCAST_SEND: "Рассылка отправлена",
  PROJECT_APPROVE: "Проект одобрен",
  PROJECT_REJECT: "Проект отклонён",
  PORTFOLIO_APPROVE: "Портфолио одобрено",
  PORTFOLIO_REJECT: "Портфолио отклонено",
  AVATAR_APPROVE: "Аватар одобрен",
  AVATAR_REJECT: "Аватар отклонён",
  TICKET_RESOLVE: "Обращение решено",
  TICKET_ASSIGN: "Обращение назначено",
  CMS_PAGE_SAVE: "CMS страница сохранена",
  CATALOG_CATEGORY_DELETE: "Категория удалена",
  CATALOG_SKILL_DELETE: "Навык удалён",
  REPORT_RESOLVE_NO_ACTION: "Жалоба решена без санкций",
};

const STAFF_PERMISSIONS_RU: Record<string, { label: string; description: string }> = {
  FULL_ACCESS: {
    label: "Полный доступ",
    description: "Все функции админ-панели, включая управление командой",
  },
  STAFF_MANAGE: {
    label: "Управление админами",
    description: "Добавление и редактирование администраторов",
  },
  MODERATION: {
    label: "Модерация",
    description: "Споры, закрытие проектов, модерация контента",
  },
  USERS: {
    label: "Пользователи",
    description: "Просмотр и управление аккаунтами клиентов и фрилансеров",
  },
  FINANCE: {
    label: "Финансы",
    description: "Платежи, эскроу и финансовые операции",
  },
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
      viewProject: "Открыть проект",
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
    chrome: {
      workAsClient: "Как заказчик",
      workAsFreelancer: "Как фрилансер",
      profileMenuAria: "Меню профиля",
      adminFallback: "Администратор",
      superAdminRole: "главный администратор",
      myCabinet: "Мой кабинет",
      adminPanel: "Админ-панель",
      messages: "Переписки",
      personalData: "Личные данные",
      settings: "Настройки",
      signOut: "Выход",
    },
    cabinetHome: {
      metaTitle: "Кабинет администратора",
      metaDescription: "Личный кабинет главного администратора Taskery",
      title: "Кабинет администратора",
      description:
        "Выберите режим работы на платформе. Выбранный режим сохранится в меню и шапке сайта.",
      panelTitle: "Админ-панель",
      panelDescription: "Модерация, пользователи, финансы и управление платформой.",
      asClient: "Работа как заказчик",
      asClientDesc: "Создавайте проекты, выбирайте исполнителей и ведите переписку.",
      asFreelancer: "Работа как фрилансер",
      asFreelancerDesc: "Откликайтесь на проекты, выполняйте задачи и ведите портфолио.",
      messages: "Переписки",
      messagesDesc: "Все сообщения по проектам в одном месте.",
      finances: "Финансы",
      financesDesc: "Баланс, резервы и история операций.",
    },
    users: {
      title: "Пользователи",
      description: "Поиск, блокировка и удаление аккаунтов клиентов и фрилансеров.",
      exportCsv: "Экспорт CSV",
      searchPlaceholder: "Email, имя или ID",
      roleAll: "Все роли",
      roleClients: "Заказчики",
      roleFreelancers: "Фрилансеры",
      statusAll: "Все статусы",
      statusActive: "Активные",
      statusBanned: "Заблокированные",
      statusDeleted: "Удалённые",
      search: "Найти",
      notFound: "Пользователи не найдены",
      noName: "Без имени",
      accountDeleted: "Аккаунт удалён",
      unban: "Разблокировать",
      ban: "Заблокировать",
      delete: "Удалить",
      deleteReason: "Причина удаления",
      badgeDeleted: "Удалён",
      badgeTempBan: "Временный бан",
      badgeBanned: "Заблокирован",
      badgeActive: "Активен",
      colUser: "Пользователь",
      colRole: "Роль",
      colBalance: "Баланс",
      colActivity: "Активность",
      colStatus: "Статус",
      colActions: "Действия",
      projects: "Проектов",
      contracts: "Сделок",
      rating: "Рейтинг",
      memberSince: "с",
      roles: { CLIENT: "Заказчик", FREELANCER: "Фрилансер", ADMIN: "Админ" },
      sanctions: {
        hide: "Скрыть санкции",
        show: "Санкции ▾",
        warningsShort: "предупр.",
        warnPlaceholder: "Предупреждение",
        warn: "Предупредить",
        daysTitle: "Дней",
        tempBanReason: "Причина временного бана",
        tempBan: "Временный бан",
        fineAmount: "₴",
        fineReason: "Причина штрафа",
        fine: "Штраф",
      },
    },
    verification: {
      title: "Верификация профилей",
      subtitle: "Заявки фрилансеров на подтверждение профиля",
      inQueue: "в очереди",
      empty: "Нет заявок на рассмотрении",
      rejectReason: "Причина отклонения (видна пользователю)",
      approve: "Верифицировать",
      approved: "Профиль верифицирован",
      noName: "Без имени",
      projects: "проектов",
      skills: "навыков",
    },
    cms: {
      title: "CMS — статические страницы",
      urlHint: "Страницы доступны по адресу /[locale]/pages/[slug]",
      pageLabel: "Страница",
      languageLabel: "Язык",
      titleLabel: "Заголовок",
      bodyLabel: "Текст (HTML/Markdown)",
      saving: "Сохранение…",
      save: "Сохранить страницу",
      saved: "Сохранено",
      slugs: {
        terms: "Условия использования",
        privacy: "Политика конфиденциальности",
        "about-extra": "О платформе (доп.)",
      },
    },
    finance: {
      title: "Финансы",
      description: "Балансы, эскроу, комиссии и история платежей платформы.",
      statUserBalances: "Балансы пользователей",
      statUserBalancesHint: "Сумма на счетах",
      statEscrow: "В эскроу",
      activeDeals: "активных сделок",
      turnover: "Оборот",
      statCommissions: "Комиссия платформы",
      statTopups: "Пополнения",
      paymentsTotal: "платежей всего",
      activeContractsTitle: "Активные сделки",
      noActiveEscrow: "Нет активного эскроу",
      commission: "комиссия",
      clientLabel: "Заказчик",
      freelancerLabel: "Исполнитель",
      recentPaymentsTitle: "Последние платежи",
      noPayments: "Платежей пока нет",
      colUser: "Пользователь",
      colType: "Тип",
      colAmount: "Сумма",
      colStatus: "Статус",
      colDate: "Дата",
      paymentTypes: FINANCE_PAYMENT_TYPES_RU,
      paymentStatuses: FINANCE_PAYMENT_STATUSES_RU,
      contractStatuses: FINANCE_CONTRACT_STATUSES_RU,
      balanceAdjust: {
        title: "Корректировка баланса",
        description:
          "Пополнение (+) или списание (−) баланса пользователя. Действие записывается в журнал.",
        userIdLabel: "ID пользователя",
        userIdPlaceholder: "cuid…",
        amountLabel: "Сумма (₴)",
        amountPlaceholder: "+500 или -100",
        reasonLabel: "Причина",
        reasonPlaceholder: "Компенсация / возврат",
        applying: "Применяем…",
        apply: "Применить",
        success: "Баланс обновлён",
      },
    },
    withdrawals: {
      title: "Заявки на вывод",
      description: "Одобрение переводов на карту или IBAN",
      inQueue: "в очереди",
      totalAmount: "На сумму",
      empty: "Нет заявок на вывод",
      approve: "Одобрить",
      approved: "Вывод одобрен",
      rejectReason: "Причина отклонения (видна пользователю)",
      rejectAndRefund: "Отклонить и вернуть на баланс",
      balance: "Баланс",
    },
    catalog: {
      title: "Каталог",
      description: "Категории проектов и навыки фрилансеров",
      categories: "Категории",
      skills: "Навыки",
      nameLabel: "Название",
      descriptionLabel: "Описание",
      saving: "Сохранение…",
      save: "Сохранить",
      addCategory: "Добавить категорию",
      saved: "Сохранено",
      minBudgetTitle: "Минимальный бюджет проекта",
      minBudgetHint: "Пустое поле — ограничение не действует для этой валюты.",
      noCategory: "Без категории",
      addSkill: "Добавить навык",
      categoryLabel: "Категория",
      skillsCount: "навыков",
      projectsCount: "проектов",
      freelancersShort: "фрил.",
    },
    broadcast: {
      title: "Рассылка",
      description: "Массовое уведомление в колокольчик пользователям платформы",
      audience: "Аудитория",
      audienceAll: "Все пользователи",
      audienceAllHint: "фрилансеров и заказчиков",
      audienceFreelancers: "Только фрилансеры",
      audienceFreelancersHint: "получателей",
      audienceClients: "Только заказчики",
      audienceClientsHint: "получателей",
      titleLabel: "Заголовок",
      titlePlaceholder: "Обновление правил платформы",
      bodyLabel: "Текст",
      bodyPlaceholder: "Кратко опишите, что изменилось или что важно знать",
      linkLabel: "Ссылка (необязательно)",
      linkPlaceholder: "/faq или /projects",
      linkHint: "Внутренний путь, начинающийся с /",
      confirmCheckbox:
        "Понимаю, что уведомление получат все пользователи выбранной аудитории (кроме заблокированных)",
      send: "Отправить рассылку",
      sending: "Отправка…",
      sentSuccess: "Рассылка отправлена",
      recipientsSuffix: "пользователям",
    },
    analytics: {
      title: "Аналитика платформы",
      description: "Ключевые метрики и динамика за выбранный период.",
      exportCsv: "Экспорт CSV",
      periodDays: "дн.",
      daysShort: "д",
      newUsers: "Новых пользователей",
      newProjects: "Новых проектов",
      gmvReleased: "GMV завершённых сделок",
      platformCommissions: "Комиссии платформы",
      openDisputes: "Открытых споров",
      pendingReports: "Жалоб в очереди",
      pendingWithdrawals: "Заявок на вывод",
      activeEscrow: "Эскроу (активные)",
      chartSignups: "Регистрации",
      chartProjects: "Новые проекты",
      chartGmv: "GMV по дням",
    },
    audit: {
      title: "Журнал действий",
      description: "Последние действия администраторов на платформе",
      exportCsv: "Экспорт CSV",
      empty: "Записей пока нет",
      target: "target",
      actions: AUDIT_ACTIONS_RU,
    },
    staff: {
      title: "Команда администраторов",
      description:
        "Добавляйте админов с разными функциями: модерация, пользователи, финансы и управление командой.",
      addAdmin: "+ Добавить администратора",
      newAdminTitle: "Новый администратор",
      name: "Имя",
      email: "Email",
      password: "Пароль",
      namePlaceholder: "Мария Иванова",
      passwordMinPlaceholder: "Минимум 8 символов",
      newPassword: "Новый пароль",
      passwordKeepEmpty: "Оставьте пустым, чтобы не менять",
      functions: "Функции",
      adminAdded: "Администратор добавлен",
      saving: "Сохранение…",
      create: "Создать",
      cancel: "Отмена",
      edit: "Изменить",
      changesSaved: "Изменения сохранены",
      save: "Сохранить",
      close: "Закрыть",
      deactivate: "Деактивировать",
      deactivated: "Администратор деактивирован",
      reactivate: "Восстановить",
      reactivating: "Восстановление…",
      restored: "Администратор восстановлен",
      deleteConfirm:
        "Удалить администратора навсегда? Это действие нельзя отменить.",
      deleteForever: "Удалить навсегда",
      deleting: "Удаление…",
      deleted: "Администратор удалён",
      noName: "Без имени",
      you: "Вы",
      deactivatedBadge: "Деактивирован",
      fullAccess: "Полный доступ",
      permissions: STAFF_PERMISSIONS_RU,
    },
    login: {
      badge: "Администрирование",
      title: "Вход администратора",
      description:
        "Отдельный вход для главного администратора платформы. После входа откроется личный кабинет.",
      emailLabel: "Email администратора",
      passwordLabel: "Пароль",
      totpLabel: "Код 2FA (если включён)",
      errorInvalid: "Неверный email, пароль или недостаточно прав",
      signingIn: "Входим…",
      submit: "Войти",
      backToSite: "Вернуться на сайт",
      devAccount: "Dev-аккаунт",
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
      viewProject: "Відкрити проєкт",
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
    chrome: {
      workAsClient: "Як замовник",
      workAsFreelancer: "Як фрілансер",
      profileMenuAria: "Меню профілю",
      adminFallback: "Адміністратор",
      superAdminRole: "головний адміністратор",
      myCabinet: "Мій кабінет",
      adminPanel: "Адмін-панель",
      messages: "Переписки",
      personalData: "Особисті дані",
      settings: "Налаштування",
      signOut: "Вийти",
    },
    cabinetHome: {
      metaTitle: "Кабінет адміністратора",
      metaDescription: "Особистий кабінет головного адміністратора Taskery",
      title: "Кабінет адміністратора",
      description:
        "Оберіть режим роботи на платформі. Обраний режим збережеться в меню та шапці сайту.",
      panelTitle: "Адмін-панель",
      panelDescription: "Модерація, користувачі, фінанси та керування платформою.",
      asClient: "Робота як замовник",
      asClientDesc: "Створюйте проєкти, обирайте виконавців і ведіть переписку.",
      asFreelancer: "Робота як фрілансер",
      asFreelancerDesc: "Відгукуйтесь на проєкти, виконуйте задачі та ведіть портфоліо.",
      messages: "Переписки",
      messagesDesc: "Усі повідомлення за проєктами в одному місці.",
      finances: "Фінанси",
      financesDesc: "Баланс, резерви та історія операцій.",
    },
    users: {
      title: "Користувачі",
      description: "Пошук, блокування та видалення акаунтів замовників і фрілансерів.",
      exportCsv: "Експорт CSV",
      searchPlaceholder: "Email, ім'я або ID",
      roleAll: "Усі ролі",
      roleClients: "Замовники",
      roleFreelancers: "Фрілансери",
      statusAll: "Усі статуси",
      statusActive: "Активні",
      statusBanned: "Заблоковані",
      statusDeleted: "Видалені",
      search: "Знайти",
      notFound: "Користувачів не знайдено",
      noName: "Без імені",
      accountDeleted: "Акаунт видалено",
      unban: "Розблокувати",
      ban: "Заблокувати",
      delete: "Видалити",
      deleteReason: "Причина видалення",
      badgeDeleted: "Видалено",
      badgeTempBan: "Тимчасовий бан",
      badgeBanned: "Заблоковано",
      badgeActive: "Активний",
      colUser: "Користувач",
      colRole: "Роль",
      colBalance: "Баланс",
      colActivity: "Активність",
      colStatus: "Статус",
      colActions: "Дії",
      projects: "Проєктів",
      contracts: "Угод",
      rating: "Рейтинг",
      memberSince: "з",
      roles: { CLIENT: "Замовник", FREELANCER: "Фрілансер", ADMIN: "Адмін" },
      sanctions: {
        hide: "Приховати санкції",
        show: "Санкції ▾",
        warningsShort: "попередж.",
        warnPlaceholder: "Попередження",
        warn: "Попередити",
        daysTitle: "Днів",
        tempBanReason: "Причина тимчасового бану",
        tempBan: "Тимчасовий бан",
        fineAmount: "₴",
        fineReason: "Причина штрафу",
        fine: "Штраф",
      },
    },
    verification: {
      title: "Верифікація профілів",
      subtitle: "Заявки фрілансерів на підтвердження профілю",
      inQueue: "у черзі",
      empty: "Немає заявок на розгляд",
      rejectReason: "Причина відхилення (видна користувачу)",
      approve: "Верифікувати",
      approved: "Профіль верифіковано",
      noName: "Без імені",
      projects: "проєктів",
      skills: "навичок",
    },
    cms: {
      title: "CMS — статичні сторінки",
      urlHint: "Сторінки доступні за адресою /[locale]/pages/[slug]",
      pageLabel: "Сторінка",
      languageLabel: "Мова",
      titleLabel: "Заголовок",
      bodyLabel: "Текст (HTML/Markdown)",
      saving: "Збереження…",
      save: "Зберегти сторінку",
      saved: "Збережено",
      slugs: {
        terms: "Умови використання",
        privacy: "Політика конфіденційності",
        "about-extra": "Про платформу (дод.)",
      },
    },
    finance: {
      title: "Фінанси",
      description: "Баланси, ескроу, комісії та історія платежів платформи.",
      statUserBalances: "Баланси користувачів",
      statUserBalancesHint: "Сума на рахунках",
      statEscrow: "В ескроу",
      activeDeals: "активних угод",
      turnover: "Оборот",
      statCommissions: "Комісія платформи",
      statTopups: "Поповнення",
      paymentsTotal: "платежів загалом",
      activeContractsTitle: "Активні угоди",
      noActiveEscrow: "Немає активного ескроу",
      commission: "комісія",
      clientLabel: "Замовник",
      freelancerLabel: "Виконавець",
      recentPaymentsTitle: "Останні платежі",
      noPayments: "Платежів поки немає",
      colUser: "Користувач",
      colType: "Тип",
      colAmount: "Сума",
      colStatus: "Статус",
      colDate: "Дата",
      paymentTypes: {
        BALANCE_TOPUP: "Поповнення",
        SUBSCRIPTION: "Підписка",
        FEATURE_PROJECT: "Просування проєкту",
        FEATURE_PROFILE: "Просування профілю",
        COMMISSION: "Комісія",
        ADMIN_ADJUSTMENT: "Коригування",
        FINE: "Штраф",
        WITHDRAWAL: "Виведення",
      },
      paymentStatuses: {
        PENDING: "Очікує",
        COMPLETED: "Завершено",
        FAILED: "Помилка",
        REFUNDED: "Повернення",
      },
      contractStatuses: {
        AWAITING_FUNDING: "Очікує внесення коштів",
        ESCROWED: "Кошти в ескроу",
        RELEASED: "Виплачено виконавцю",
        REFUNDED: "Повернено замовнику",
      },
      balanceAdjust: {
        title: "Коригування балансу",
        description:
          "Поповнення (+) або списання (−) балансу користувача. Дію записано в журнал.",
        userIdLabel: "ID користувача",
        userIdPlaceholder: "cuid…",
        amountLabel: "Сума (₴)",
        amountPlaceholder: "+500 або -100",
        reasonLabel: "Причина",
        reasonPlaceholder: "Компенсація / повернення",
        applying: "Застосовуємо…",
        apply: "Застосувати",
        success: "Баланс оновлено",
      },
    },
    withdrawals: {
      title: "Заявки на виведення",
      description: "Схвалення переказів на картку або IBAN",
      inQueue: "у черзі",
      totalAmount: "На суму",
      empty: "Немає заявок на виведення",
      approve: "Схвалити",
      approved: "Виведення схвалено",
      rejectReason: "Причина відхилення (видна користувачу)",
      rejectAndRefund: "Відхилити та повернути на баланс",
      balance: "Баланс",
    },
    catalog: {
      title: "Каталог",
      description: "Категорії проєктів і навички фрілансерів",
      categories: "Категорії",
      skills: "Навички",
      nameLabel: "Назва",
      descriptionLabel: "Опис",
      saving: "Збереження…",
      save: "Зберегти",
      addCategory: "Додати категорію",
      saved: "Збережено",
      minBudgetTitle: "Мінімальний бюджет проєкту",
      minBudgetHint: "Порожнє поле — обмеження не діє для цієї валюти.",
      noCategory: "Без категорії",
      addSkill: "Додати навичку",
      categoryLabel: "Категорія",
      skillsCount: "навичок",
      projectsCount: "проєктів",
      freelancersShort: "фріл.",
    },
    broadcast: {
      title: "Розсилка",
      description: "Масове сповіщення в дзвіночок користувачам платформи",
      audience: "Аудиторія",
      audienceAll: "Усі користувачі",
      audienceAllHint: "фрілансерів і замовників",
      audienceFreelancers: "Лише фрілансери",
      audienceFreelancersHint: "отримувачів",
      audienceClients: "Лише замовники",
      audienceClientsHint: "отримувачів",
      titleLabel: "Заголовок",
      titlePlaceholder: "Оновлення правил платформи",
      bodyLabel: "Текст",
      bodyPlaceholder: "Коротко опишіть, що змінилося або що важливо знати",
      linkLabel: "Посилання (необов'язково)",
      linkPlaceholder: "/faq або /projects",
      linkHint: "Внутрішній шлях, що починається з /",
      confirmCheckbox:
        "Розумію, що сповіщення отримають усі користувачі обраної аудиторії (крім заблокованих)",
      send: "Надіслати розсилку",
      sending: "Надсилання…",
      sentSuccess: "Розсилку надіслано",
      recipientsSuffix: "користувачам",
    },
    analytics: {
      title: "Аналітика платформи",
      description: "Ключові метрики та динаміка за обраний період.",
      exportCsv: "Експорт CSV",
      periodDays: "дн.",
      daysShort: "д",
      newUsers: "Нових користувачів",
      newProjects: "Нових проєктів",
      gmvReleased: "GMV завершених угод",
      platformCommissions: "Комісії платформи",
      openDisputes: "Відкритих спорів",
      pendingReports: "Скарг у черзі",
      pendingWithdrawals: "Заявок на виведення",
      activeEscrow: "Ескроу (активні)",
      chartSignups: "Реєстрації",
      chartProjects: "Нові проєкти",
      chartGmv: "GMV по днях",
    },
    audit: {
      title: "Журнал дій",
      description: "Останні дії адміністраторів на платформі",
      exportCsv: "Експорт CSV",
      empty: "Записів поки немає",
      target: "target",
      actions: {
        DISPUTE_RELEASE: "Спір: виплата виконавцю",
        DISPUTE_REFUND: "Спір: повернення замовнику",
        DISPUTE_SPLIT: "Спір: часткове рішення",
        PROJECT_CLOSE: "Проєкт закрито",
        PROJECT_BLOCK: "Проєкт заблоковано",
        USER_BAN: "Користувача заблоковано",
        USER_UNBAN: "Користувача розблоковано",
        USER_DELETE: "Користувача видалено",
        REPORT_DISMISS: "Скарги відхилено",
        REPORT_RESOLVE: "Скарги вирішено",
        REPORT_IN_REVIEW: "Скаргу взято в роботу",
        STAFF_CREATE: "Адміна додано",
        STAFF_UPDATE: "Адміна змінено",
        STAFF_DEACTIVATE: "Адміна деактивовано",
        STAFF_REACTIVATE: "Адміна відновлено",
        STAFF_DELETE: "Адміна видалено",
        USER_WARNING: "Попередження користувачу",
        USER_TEMP_BAN: "Тимчасове блокування",
        USER_FINE: "Штраф користувачу",
        BALANCE_ADJUST: "Коригування балансу",
        TICKET_REPLY: "Відповідь у підтримці",
        TICKET_CLOSE: "Звернення закрито",
        VERIFICATION_APPROVE: "Верифікацію схвалено",
        VERIFICATION_REJECT: "Верифікацію відхилено",
        CATALOG_CATEGORY_SAVE: "Категорію збережено",
        CATALOG_SKILL_SAVE: "Навичку збережено",
        WITHDRAWAL_APPROVE: "Виведення схвалено",
        WITHDRAWAL_REJECT: "Виведення відхилено",
        BROADCAST_SEND: "Розсилку надіслано",
        PROJECT_APPROVE: "Проєкт схвалено",
        PROJECT_REJECT: "Проєкт відхилено",
        PORTFOLIO_APPROVE: "Портфоліо схвалено",
        PORTFOLIO_REJECT: "Портфоліо відхилено",
        AVATAR_APPROVE: "Аватар схвалено",
        AVATAR_REJECT: "Аватар відхилено",
        TICKET_RESOLVE: "Звернення вирішено",
        TICKET_ASSIGN: "Звернення призначено",
        CMS_PAGE_SAVE: "CMS сторінку збережено",
        CATALOG_CATEGORY_DELETE: "Категорію видалено",
        CATALOG_SKILL_DELETE: "Навичку видалено",
        REPORT_RESOLVE_NO_ACTION: "Скаргу вирішено без санкцій",
      },
    },
    staff: {
      title: "Команда адміністраторів",
      description:
        "Додавайте адмінів з різними функціями: модерація, користувачі, фінанси та управління командою.",
      addAdmin: "+ Додати адміністратора",
      newAdminTitle: "Новий адміністратор",
      name: "Ім'я",
      email: "Email",
      password: "Пароль",
      namePlaceholder: "Марія Іванова",
      passwordMinPlaceholder: "Мінімум 8 символів",
      newPassword: "Новий пароль",
      passwordKeepEmpty: "Залиште порожнім, щоб не змінювати",
      functions: "Функції",
      adminAdded: "Адміністратора додано",
      saving: "Збереження…",
      create: "Створити",
      cancel: "Скасувати",
      edit: "Змінити",
      changesSaved: "Зміни збережено",
      save: "Зберегти",
      close: "Закрити",
      deactivate: "Деактивувати",
      deactivated: "Адміністратора деактивовано",
      reactivate: "Відновити",
      reactivating: "Відновлення…",
      restored: "Адміністратора відновлено",
      deleteConfirm:
        "Видалити адміністратора назавжди? Цю дію не можна скасувати.",
      deleteForever: "Видалити назавжди",
      deleting: "Видалення…",
      deleted: "Адміністратора видалено",
      noName: "Без імені",
      you: "Ви",
      deactivatedBadge: "Деактивовано",
      fullAccess: "Повний доступ",
      permissions: {
        FULL_ACCESS: {
          label: "Повний доступ",
          description: "Усі функції адмін-панелі, включно з управлінням командою",
        },
        STAFF_MANAGE: {
          label: "Управління адмінами",
          description: "Додавання та редагування адміністраторів",
        },
        MODERATION: {
          label: "Модерація",
          description: "Спори, закриття проєктів, модерація контенту",
        },
        USERS: {
          label: "Користувачі",
          description: "Перегляд і управління акаунтами замовників і фрілансерів",
        },
        FINANCE: {
          label: "Фінанси",
          description: "Платежі, ескроу та фінансові операції",
        },
      },
    },
    login: {
      badge: "Адміністрування",
      title: "Вхід адміністратора",
      description:
        "Окремий вхід для головного адміністратора платформи. Після входу відкриється особистий кабінет.",
      emailLabel: "Email адміністратора",
      passwordLabel: "Пароль",
      totpLabel: "Код 2FA (якщо увімкнено)",
      errorInvalid: "Невірний email, пароль або недостатньо прав",
      signingIn: "Входимо…",
      submit: "Увійти",
      backToSite: "Повернутися на сайт",
      devAccount: "Dev-акаунт",
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
      viewProject: "Otwórz projekt",
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
    chrome: {
      workAsClient: "Jako zleceniodawca",
      workAsFreelancer: "Jako freelancer",
      profileMenuAria: "Menu profilu",
      adminFallback: "Administrator",
      superAdminRole: "główny administrator",
      myCabinet: "Mój panel",
      adminPanel: "Panel admina",
      messages: "Wiadomości",
      personalData: "Dane osobowe",
      settings: "Ustawienia",
      signOut: "Wyloguj",
    },
    cabinetHome: {
      metaTitle: "Panel administratora",
      metaDescription: "Osobisty panel głównego administratora Taskery",
      title: "Panel administratora",
      description:
        "Wybierz tryb pracy na platformie. Wybrany tryb zostanie zapisany w menu i nagłówku.",
      panelTitle: "Panel admina",
      panelDescription: "Moderacja, użytkownicy, finanse i zarządzanie platformą.",
      asClient: "Praca jako zleceniodawca",
      asClientDesc: "Twórz projekty, wybieraj wykonawców i prowadź korespondencję.",
      asFreelancer: "Praca jako freelancer",
      asFreelancerDesc: "Odpowiadaj na projekty, realizuj zadania i prowadź portfolio.",
      messages: "Wiadomości",
      messagesDesc: "Wszystkie wiadomości projektowe w jednym miejscu.",
      finances: "Finanse",
      financesDesc: "Saldo, rezerwy i historia operacji.",
    },
    users: {
      title: "Użytkownicy",
      description: "Wyszukiwanie, blokowanie i usuwanie kont klientów i freelancerów.",
      exportCsv: "Eksport CSV",
      searchPlaceholder: "Email, imię lub ID",
      roleAll: "Wszystkie role",
      roleClients: "Zleceniodawcy",
      roleFreelancers: "Freelancerzy",
      statusAll: "Wszystkie statusy",
      statusActive: "Aktywne",
      statusBanned: "Zablokowane",
      statusDeleted: "Usunięte",
      search: "Szukaj",
      notFound: "Nie znaleziono użytkowników",
      noName: "Bez imienia",
      accountDeleted: "Konto usunięte",
      unban: "Odblokuj",
      ban: "Zablokuj",
      delete: "Usuń",
      deleteReason: "Powód usunięcia",
      badgeDeleted: "Usunięty",
      badgeTempBan: "Tymczasowy ban",
      badgeBanned: "Zablokowany",
      badgeActive: "Aktywny",
      colUser: "Użytkownik",
      colRole: "Rola",
      colBalance: "Saldo",
      colActivity: "Aktywność",
      colStatus: "Status",
      colActions: "Akcje",
      projects: "Projektów",
      contracts: "Umów",
      rating: "Ocena",
      memberSince: "od",
      roles: { CLIENT: "Zleceniodawca", FREELANCER: "Freelancer", ADMIN: "Admin" },
      sanctions: {
        hide: "Ukryj sankcje",
        show: "Sankcje ▾",
        warningsShort: "ostrzeż.",
        warnPlaceholder: "Ostrzeżenie",
        warn: "Ostrzeż",
        daysTitle: "Dni",
        tempBanReason: "Powód tymczasowego bana",
        tempBan: "Tymczasowy ban",
        fineAmount: "₴",
        fineReason: "Powód kary",
        fine: "Kara",
      },
    },
    verification: {
      title: "Weryfikacja profili",
      subtitle: "Wnioski freelancerów o potwierdzenie profilu",
      inQueue: "w kolejce",
      empty: "Brak wniosków do rozpatrzenia",
      rejectReason: "Powód odrzucenia (widoczny dla użytkownika)",
      approve: "Zweryfikuj",
      approved: "Profil zweryfikowany",
      noName: "Bez imienia",
      projects: "projektów",
      skills: "umiejętności",
    },
    cms: {
      title: "CMS — strony statyczne",
      urlHint: "Strony dostępne pod adresem /[locale]/pages/[slug]",
      pageLabel: "Strona",
      languageLabel: "Język",
      titleLabel: "Tytuł",
      bodyLabel: "Treść (HTML/Markdown)",
      saving: "Zapisywanie…",
      save: "Zapisz stronę",
      saved: "Zapisano",
      slugs: {
        terms: "Regulamin",
        privacy: "Polityka prywatności",
        "about-extra": "O platformie (dod.)",
      },
    },
    finance: {
      title: "Finanse",
      description: "Salda, escrow, prowizje i historia płatności platformy.",
      statUserBalances: "Salda użytkowników",
      statUserBalancesHint: "Suma na kontach",
      statEscrow: "W escrow",
      activeDeals: "aktywnych umów",
      turnover: "Obrót",
      statCommissions: "Prowizja platformy",
      statTopups: "Doładowania",
      paymentsTotal: "płatności łącznie",
      activeContractsTitle: "Aktywne umowy",
      noActiveEscrow: "Brak aktywnego escrow",
      commission: "prowizja",
      clientLabel: "Zleceniodawca",
      freelancerLabel: "Freelancer",
      recentPaymentsTitle: "Ostatnie płatności",
      noPayments: "Brak płatności",
      colUser: "Użytkownik",
      colType: "Typ",
      colAmount: "Kwota",
      colStatus: "Status",
      colDate: "Data",
      paymentTypes: {
        BALANCE_TOPUP: "Doładowanie",
        SUBSCRIPTION: "Subskrypcja",
        FEATURE_PROJECT: "Promocja projektu",
        FEATURE_PROFILE: "Promocja profilu",
        COMMISSION: "Prowizja",
        ADMIN_ADJUSTMENT: "Korekta",
        FINE: "Kara",
        WITHDRAWAL: "Wypłata",
      },
      paymentStatuses: {
        PENDING: "Oczekuje",
        COMPLETED: "Zakończone",
        FAILED: "Błąd",
        REFUNDED: "Zwrot",
      },
      contractStatuses: {
        AWAITING_FUNDING: "Oczekuje wpłaty",
        ESCROWED: "Środki w escrow",
        RELEASED: "Wypłacono freelancerowi",
        REFUNDED: "Zwrócono zleceniodawcy",
      },
      balanceAdjust: {
        title: "Korekta salda",
        description:
          "Doładowanie (+) lub obciążenie (−) salda użytkownika. Operacja trafia do dziennika.",
        userIdLabel: "ID użytkownika",
        userIdPlaceholder: "cuid…",
        amountLabel: "Kwota (₴)",
        amountPlaceholder: "+500 lub -100",
        reasonLabel: "Powód",
        reasonPlaceholder: "Kompensata / zwrot",
        applying: "Stosowanie…",
        apply: "Zastosuj",
        success: "Saldo zaktualizowane",
      },
    },
    withdrawals: {
      title: "Wnioski o wypłatę",
      description: "Zatwierdzanie przelewów na kartę lub IBAN",
      inQueue: "w kolejce",
      totalAmount: "Na kwotę",
      empty: "Brak wniosków o wypłatę",
      approve: "Zatwierdź",
      approved: "Wypłata zatwierdzona",
      rejectReason: "Powód odrzucenia (widoczny dla użytkownika)",
      rejectAndRefund: "Odrzuć i zwróć na saldo",
      balance: "Saldo",
    },
    catalog: {
      title: "Katalog",
      description: "Kategorie projektów i umiejętności freelancerów",
      categories: "Kategorie",
      skills: "Umiejętności",
      nameLabel: "Nazwa",
      descriptionLabel: "Opis",
      saving: "Zapisywanie…",
      save: "Zapisz",
      addCategory: "Dodaj kategorię",
      saved: "Zapisano",
      minBudgetTitle: "Minimalny budżet projektu",
      minBudgetHint: "Puste pole — brak limitu dla tej waluty.",
      noCategory: "Bez kategorii",
      addSkill: "Dodaj umiejętność",
      categoryLabel: "Kategoria",
      skillsCount: "umiejętności",
      projectsCount: "projektów",
      freelancersShort: "freel.",
    },
    broadcast: {
      title: "Broadcast",
      description: "Masowe powiadomienie dzwonka dla użytkowników platformy",
      audience: "Odbiorcy",
      audienceAll: "Wszyscy użytkownicy",
      audienceAllHint: "freelancerów i zleceniodawców",
      audienceFreelancers: "Tylko freelancerzy",
      audienceFreelancersHint: "odbiorców",
      audienceClients: "Tylko zleceniodawcy",
      audienceClientsHint: "odbiorców",
      titleLabel: "Tytuł",
      titlePlaceholder: "Aktualizacja zasad platformy",
      bodyLabel: "Treść",
      bodyPlaceholder: "Krótko opisz, co się zmieniło lub co warto wiedzieć",
      linkLabel: "Link (opcjonalnie)",
      linkPlaceholder: "/faq lub /projects",
      linkHint: "Wewnętrzna ścieżka zaczynająca się od /",
      confirmCheckbox:
        "Rozumiem, że powiadomienie otrzymają wszyscy użytkownicy wybranej grupy (oprócz zablokowanych)",
      send: "Wyślij broadcast",
      sending: "Wysyłanie…",
      sentSuccess: "Broadcast wysłany",
      recipientsSuffix: "użytkownikom",
    },
    analytics: {
      title: "Analityka platformy",
      description: "Kluczowe metryki i dynamika za wybrany okres.",
      exportCsv: "Eksport CSV",
      periodDays: "dni",
      daysShort: "d",
      newUsers: "Nowych użytkowników",
      newProjects: "Nowych projektów",
      gmvReleased: "GMV zakończonych umów",
      platformCommissions: "Prowizje platformy",
      openDisputes: "Otwartych sporów",
      pendingReports: "Zgłoszeń w kolejce",
      pendingWithdrawals: "Wniosków o wypłatę",
      activeEscrow: "Escrow (aktywne)",
      chartSignups: "Rejestracje",
      chartProjects: "Nowe projekty",
      chartGmv: "GMV dziennie",
    },
    audit: {
      title: "Dziennik działań",
      description: "Ostatnie działania administratorów na platformie",
      exportCsv: "Eksport CSV",
      empty: "Brak wpisów",
      target: "target",
      actions: {
        DISPUTE_RELEASE: "Spór: wypłata freelancerowi",
        DISPUTE_REFUND: "Spór: zwrot zleceniodawcy",
        DISPUTE_SPLIT: "Spór: częściowe rozstrzygnięcie",
        PROJECT_CLOSE: "Projekt zamknięty",
        PROJECT_BLOCK: "Projekt zablokowany",
        USER_BAN: "Użytkownik zablokowany",
        USER_UNBAN: "Użytkownik odblokowany",
        USER_DELETE: "Użytkownik usunięty",
        REPORT_DISMISS: "Zgłoszenia odrzucone",
        REPORT_RESOLVE: "Zgłoszenia rozwiązane",
        REPORT_IN_REVIEW: "Zgłoszenie przejęte",
        STAFF_CREATE: "Admin dodany",
        STAFF_UPDATE: "Admin zmieniony",
        STAFF_DEACTIVATE: "Admin dezaktywowany",
        STAFF_REACTIVATE: "Admin przywrócony",
        STAFF_DELETE: "Admin usunięty",
        USER_WARNING: "Ostrzeżenie użytkownikowi",
        USER_TEMP_BAN: "Tymczasowa blokada",
        USER_FINE: "Kara użytkownikowi",
        BALANCE_ADJUST: "Korekta salda",
        TICKET_REPLY: "Odpowiedź wsparcia",
        TICKET_CLOSE: "Zgłoszenie zamknięte",
        VERIFICATION_APPROVE: "Weryfikacja zatwierdzona",
        VERIFICATION_REJECT: "Weryfikacja odrzucona",
        CATALOG_CATEGORY_SAVE: "Kategoria zapisana",
        CATALOG_SKILL_SAVE: "Umiejętność zapisana",
        WITHDRAWAL_APPROVE: "Wypłata zatwierdzona",
        WITHDRAWAL_REJECT: "Wypłata odrzucona",
        BROADCAST_SEND: "Broadcast wysłany",
        PROJECT_APPROVE: "Projekt zatwierdzony",
        PROJECT_REJECT: "Projekt odrzucony",
        PORTFOLIO_APPROVE: "Portfolio zatwierdzone",
        PORTFOLIO_REJECT: "Portfolio odrzucone",
        AVATAR_APPROVE: "Awatar zatwierdzony",
        AVATAR_REJECT: "Awatar odrzucony",
        TICKET_RESOLVE: "Zgłoszenie rozwiązane",
        TICKET_ASSIGN: "Zgłoszenie przypisane",
        CMS_PAGE_SAVE: "Strona CMS zapisana",
        CATALOG_CATEGORY_DELETE: "Kategoria usunięta",
        CATALOG_SKILL_DELETE: "Umiejętność usunięta",
        REPORT_RESOLVE_NO_ACTION: "Zgłoszenie rozwiązane bez sankcji",
      },
    },
    staff: {
      title: "Zespół administratorów",
      description:
        "Dodawaj adminów z różnymi funkcjami: moderacja, użytkownicy, finanse i zarządzanie zespołem.",
      addAdmin: "+ Dodaj administratora",
      newAdminTitle: "Nowy administrator",
      name: "Imię",
      email: "Email",
      password: "Hasło",
      namePlaceholder: "Maria Kowalska",
      passwordMinPlaceholder: "Minimum 8 znaków",
      newPassword: "Nowe hasło",
      passwordKeepEmpty: "Pozostaw puste, aby nie zmieniać",
      functions: "Funkcje",
      adminAdded: "Administrator dodany",
      saving: "Zapisywanie…",
      create: "Utwórz",
      cancel: "Anuluj",
      edit: "Edytuj",
      changesSaved: "Zmiany zapisane",
      save: "Zapisz",
      close: "Zamknij",
      deactivate: "Dezaktywuj",
      deactivated: "Administrator dezaktywowany",
      reactivate: "Przywróć",
      reactivating: "Przywracanie…",
      restored: "Administrator przywrócony",
      deleteConfirm:
        "Usunąć administratora na zawsze? Tej operacji nie można cofnąć.",
      deleteForever: "Usuń na zawsze",
      deleting: "Usuwanie…",
      deleted: "Administrator usunięty",
      noName: "Bez imienia",
      you: "Ty",
      deactivatedBadge: "Dezaktywowany",
      fullAccess: "Pełny dostęp",
      permissions: {
        FULL_ACCESS: {
          label: "Pełny dostęp",
          description: "Wszystkie funkcje panelu admina, w tym zarządzanie zespołem",
        },
        STAFF_MANAGE: {
          label: "Zarządzanie adminami",
          description: "Dodawanie i edycja administratorów",
        },
        MODERATION: {
          label: "Moderacja",
          description: "Spory, zamykanie projektów, moderacja treści",
        },
        USERS: {
          label: "Użytkownicy",
          description: "Przegląd i zarządzanie kontami klientów i freelancerów",
        },
        FINANCE: {
          label: "Finanse",
          description: "Płatności, escrow i operacje finansowe",
        },
      },
    },
    login: {
      badge: "Administracja",
      title: "Logowanie administratora",
      description:
        "Osobne logowanie dla głównego administratora platformy. Po zalogowaniu otworzy się panel.",
      emailLabel: "Email administratora",
      passwordLabel: "Hasło",
      totpLabel: "Kod 2FA (jeśli włączony)",
      errorInvalid: "Nieprawidłowy email, hasło lub brak uprawnień",
      signingIn: "Logowanie…",
      submit: "Zaloguj się",
      backToSite: "Wróć na stronę",
      devAccount: "Konto dev",
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
      viewProject: "Open project",
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
    chrome: {
      workAsClient: "As client",
      workAsFreelancer: "As freelancer",
      profileMenuAria: "Profile menu",
      adminFallback: "Administrator",
      superAdminRole: "super administrator",
      myCabinet: "My cabinet",
      adminPanel: "Admin panel",
      messages: "Messages",
      personalData: "Personal data",
      settings: "Settings",
      signOut: "Sign out",
    },
    cabinetHome: {
      metaTitle: "Administrator cabinet",
      metaDescription: "Personal cabinet for the Taskery super administrator",
      title: "Administrator cabinet",
      description:
        "Choose how you want to work on the platform. Your choice is saved in the menu and header.",
      panelTitle: "Admin panel",
      panelDescription: "Moderation, users, finance, and platform management.",
      asClient: "Work as client",
      asClientDesc: "Create projects, choose freelancers, and manage conversations.",
      asFreelancer: "Work as freelancer",
      asFreelancerDesc: "Bid on projects, deliver work, and maintain your portfolio.",
      messages: "Messages",
      messagesDesc: "All project conversations in one place.",
      finances: "Finances",
      financesDesc: "Balance, reserves, and transaction history.",
    },
    users: {
      title: "Users",
      description: "Search, block, and delete client and freelancer accounts.",
      exportCsv: "Export CSV",
      searchPlaceholder: "Email, name, or ID",
      roleAll: "All roles",
      roleClients: "Clients",
      roleFreelancers: "Freelancers",
      statusAll: "All statuses",
      statusActive: "Active",
      statusBanned: "Banned",
      statusDeleted: "Deleted",
      search: "Search",
      notFound: "No users found",
      noName: "No name",
      accountDeleted: "Account deleted",
      unban: "Unban",
      ban: "Ban",
      delete: "Delete",
      deleteReason: "Deletion reason",
      badgeDeleted: "Deleted",
      badgeTempBan: "Temporary ban",
      badgeBanned: "Banned",
      badgeActive: "Active",
      colUser: "User",
      colRole: "Role",
      colBalance: "Balance",
      colActivity: "Activity",
      colStatus: "Status",
      colActions: "Actions",
      projects: "Projects",
      contracts: "Contracts",
      rating: "Rating",
      memberSince: "since",
      roles: { CLIENT: "Client", FREELANCER: "Freelancer", ADMIN: "Admin" },
      sanctions: {
        hide: "Hide sanctions",
        show: "Sanctions ▾",
        warningsShort: "warn.",
        warnPlaceholder: "Warning",
        warn: "Warn",
        daysTitle: "Days",
        tempBanReason: "Temporary ban reason",
        tempBan: "Temporary ban",
        fineAmount: "₴",
        fineReason: "Fine reason",
        fine: "Fine",
      },
    },
    verification: {
      title: "Profile verification",
      subtitle: "Freelancer requests to verify their profile",
      inQueue: "in queue",
      empty: "No pending requests",
      rejectReason: "Rejection reason (visible to user)",
      approve: "Verify",
      approved: "Profile verified",
      noName: "No name",
      projects: "projects",
      skills: "skills",
    },
    cms: {
      title: "CMS — static pages",
      urlHint: "Pages are available at /[locale]/pages/[slug]",
      pageLabel: "Page",
      languageLabel: "Language",
      titleLabel: "Title",
      bodyLabel: "Content (HTML/Markdown)",
      saving: "Saving…",
      save: "Save page",
      saved: "Saved",
      slugs: {
        terms: "Terms of use",
        privacy: "Privacy policy",
        "about-extra": "About platform (extra)",
      },
    },
    finance: {
      title: "Finance",
      description: "Balances, escrow, commissions, and platform payment history.",
      statUserBalances: "User balances",
      statUserBalancesHint: "Total on accounts",
      statEscrow: "In escrow",
      activeDeals: "active contracts",
      turnover: "Turnover",
      statCommissions: "Platform commission",
      statTopups: "Top-ups",
      paymentsTotal: "payments total",
      activeContractsTitle: "Active contracts",
      noActiveEscrow: "No active escrow",
      commission: "commission",
      clientLabel: "Client",
      freelancerLabel: "Freelancer",
      recentPaymentsTitle: "Recent payments",
      noPayments: "No payments yet",
      colUser: "User",
      colType: "Type",
      colAmount: "Amount",
      colStatus: "Status",
      colDate: "Date",
      paymentTypes: {
        BALANCE_TOPUP: "Top-up",
        SUBSCRIPTION: "Subscription",
        FEATURE_PROJECT: "Project promotion",
        FEATURE_PROFILE: "Profile promotion",
        COMMISSION: "Commission",
        ADMIN_ADJUSTMENT: "Adjustment",
        FINE: "Fine",
        WITHDRAWAL: "Withdrawal",
      },
      paymentStatuses: {
        PENDING: "Pending",
        COMPLETED: "Completed",
        FAILED: "Failed",
        REFUNDED: "Refunded",
      },
      contractStatuses: {
        AWAITING_FUNDING: "Awaiting funding",
        ESCROWED: "Funds in escrow",
        RELEASED: "Paid to freelancer",
        REFUNDED: "Refunded to client",
      },
      balanceAdjust: {
        title: "Balance adjustment",
        description:
          "Credit (+) or debit (−) a user balance. The action is recorded in the audit log.",
        userIdLabel: "User ID",
        userIdPlaceholder: "cuid…",
        amountLabel: "Amount (₴)",
        amountPlaceholder: "+500 or -100",
        reasonLabel: "Reason",
        reasonPlaceholder: "Compensation / refund",
        applying: "Applying…",
        apply: "Apply",
        success: "Balance updated",
      },
    },
    withdrawals: {
      title: "Withdrawal requests",
      description: "Approve transfers to card or IBAN",
      inQueue: "in queue",
      totalAmount: "Total amount",
      empty: "No withdrawal requests",
      approve: "Approve",
      approved: "Withdrawal approved",
      rejectReason: "Rejection reason (visible to user)",
      rejectAndRefund: "Reject and refund to balance",
      balance: "Balance",
    },
    catalog: {
      title: "Catalog",
      description: "Project categories and freelancer skills",
      categories: "Categories",
      skills: "Skills",
      nameLabel: "Name",
      descriptionLabel: "Description",
      saving: "Saving…",
      save: "Save",
      addCategory: "Add category",
      saved: "Saved",
      minBudgetTitle: "Minimum project budget",
      minBudgetHint: "Empty field — no limit for this currency.",
      noCategory: "No category",
      addSkill: "Add skill",
      categoryLabel: "Category",
      skillsCount: "skills",
      projectsCount: "projects",
      freelancersShort: "freel.",
    },
    broadcast: {
      title: "Broadcast",
      description: "Mass bell notification to platform users",
      audience: "Audience",
      audienceAll: "All users",
      audienceAllHint: "freelancers and clients",
      audienceFreelancers: "Freelancers only",
      audienceFreelancersHint: "recipients",
      audienceClients: "Clients only",
      audienceClientsHint: "recipients",
      titleLabel: "Title",
      titlePlaceholder: "Platform rules update",
      bodyLabel: "Message",
      bodyPlaceholder: "Briefly describe what changed or what users should know",
      linkLabel: "Link (optional)",
      linkPlaceholder: "/faq or /projects",
      linkHint: "Internal path starting with /",
      confirmCheckbox:
        "I understand all users in the selected audience (except banned) will receive this notification",
      send: "Send broadcast",
      sending: "Sending…",
      sentSuccess: "Broadcast sent",
      recipientsSuffix: "users",
    },
    analytics: {
      title: "Platform analytics",
      description: "Key metrics and trends for the selected period.",
      exportCsv: "Export CSV",
      periodDays: "days",
      daysShort: "d",
      newUsers: "New users",
      newProjects: "New projects",
      gmvReleased: "GMV of completed deals",
      platformCommissions: "Platform commissions",
      openDisputes: "Open disputes",
      pendingReports: "Reports in queue",
      pendingWithdrawals: "Withdrawal requests",
      activeEscrow: "Escrow (active)",
      chartSignups: "Sign-ups",
      chartProjects: "New projects",
      chartGmv: "Daily GMV",
    },
    audit: {
      title: "Audit log",
      description: "Recent administrator actions on the platform",
      exportCsv: "Export CSV",
      empty: "No entries yet",
      target: "target",
      actions: {
        DISPUTE_RELEASE: "Dispute: pay freelancer",
        DISPUTE_REFUND: "Dispute: refund client",
        DISPUTE_SPLIT: "Dispute: partial resolution",
        PROJECT_CLOSE: "Project closed",
        PROJECT_BLOCK: "Project blocked",
        USER_BAN: "User banned",
        USER_UNBAN: "User unbanned",
        USER_DELETE: "User deleted",
        REPORT_DISMISS: "Reports dismissed",
        REPORT_RESOLVE: "Reports resolved",
        REPORT_IN_REVIEW: "Report taken for review",
        STAFF_CREATE: "Admin added",
        STAFF_UPDATE: "Admin updated",
        STAFF_DEACTIVATE: "Admin deactivated",
        STAFF_REACTIVATE: "Admin reactivated",
        STAFF_DELETE: "Admin deleted",
        USER_WARNING: "User warning",
        USER_TEMP_BAN: "Temporary ban",
        USER_FINE: "User fine",
        BALANCE_ADJUST: "Balance adjustment",
        TICKET_REPLY: "Support reply",
        TICKET_CLOSE: "Ticket closed",
        VERIFICATION_APPROVE: "Verification approved",
        VERIFICATION_REJECT: "Verification rejected",
        CATALOG_CATEGORY_SAVE: "Category saved",
        CATALOG_SKILL_SAVE: "Skill saved",
        WITHDRAWAL_APPROVE: "Withdrawal approved",
        WITHDRAWAL_REJECT: "Withdrawal rejected",
        BROADCAST_SEND: "Broadcast sent",
        PROJECT_APPROVE: "Project approved",
        PROJECT_REJECT: "Project rejected",
        PORTFOLIO_APPROVE: "Portfolio approved",
        PORTFOLIO_REJECT: "Portfolio rejected",
        AVATAR_APPROVE: "Avatar approved",
        AVATAR_REJECT: "Avatar rejected",
        TICKET_RESOLVE: "Ticket resolved",
        TICKET_ASSIGN: "Ticket assigned",
        CMS_PAGE_SAVE: "CMS page saved",
        CATALOG_CATEGORY_DELETE: "Category deleted",
        CATALOG_SKILL_DELETE: "Skill deleted",
        REPORT_RESOLVE_NO_ACTION: "Report resolved without sanctions",
      },
    },
    staff: {
      title: "Administrator team",
      description:
        "Add admins with different roles: moderation, users, finance, and team management.",
      addAdmin: "+ Add administrator",
      newAdminTitle: "New administrator",
      name: "Name",
      email: "Email",
      password: "Password",
      namePlaceholder: "Jane Smith",
      passwordMinPlaceholder: "At least 8 characters",
      newPassword: "New password",
      passwordKeepEmpty: "Leave empty to keep unchanged",
      functions: "Permissions",
      adminAdded: "Administrator added",
      saving: "Saving…",
      create: "Create",
      cancel: "Cancel",
      edit: "Edit",
      changesSaved: "Changes saved",
      save: "Save",
      close: "Close",
      deactivate: "Deactivate",
      deactivated: "Administrator deactivated",
      reactivate: "Reactivate",
      reactivating: "Reactivating…",
      restored: "Administrator restored",
      deleteConfirm:
        "Delete administrator permanently? This action cannot be undone.",
      deleteForever: "Delete permanently",
      deleting: "Deleting…",
      deleted: "Administrator deleted",
      noName: "No name",
      you: "You",
      deactivatedBadge: "Deactivated",
      fullAccess: "Full access",
      permissions: {
        FULL_ACCESS: {
          label: "Full access",
          description: "All admin panel features, including team management",
        },
        STAFF_MANAGE: {
          label: "Manage admins",
          description: "Add and edit administrators",
        },
        MODERATION: {
          label: "Moderation",
          description: "Disputes, project closure, content moderation",
        },
        USERS: {
          label: "Users",
          description: "View and manage client and freelancer accounts",
        },
        FINANCE: {
          label: "Finance",
          description: "Payments, escrow, and financial operations",
        },
      },
    },
    login: {
      badge: "Administration",
      title: "Administrator sign-in",
      description:
        "Separate sign-in for the platform super administrator. After login you will enter the admin cabinet.",
      emailLabel: "Administrator email",
      passwordLabel: "Password",
      totpLabel: "2FA code (if enabled)",
      errorInvalid: "Invalid email, password, or insufficient permissions",
      signingIn: "Signing in…",
      submit: "Sign in",
      backToSite: "Back to site",
      devAccount: "Dev account",
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
