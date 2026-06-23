export type AppLocale = "ru" | "uk" | "pl" | "en";

export type FaqItem = {
  question: string;
  answer: string;
};

export type MetaBlock = {
  title: string;
  description: string;
  keywords?: string[];
};

export type LandingFeature = {
  title: string;
  text: string;
};

export type LandingStep = {
  number: string;
  title: string;
  text: string;
};

export type LandingReason = {
  title: string;
  text: string;
};

export type Dictionary = {
  meta: {
    home: MetaBlock & { keywords: string[] };
    about: MetaBlock;
    faq: MetaBlock;
    contact: MetaBlock;
    pricing: MetaBlock;
    projects: MetaBlock;
    freelancers: MetaBlock;
    login: MetaBlock;
    register: MetaBlock;
  };
  market: {
    regionLabel: string;
    audienceLabel: string;
  };
  landing: {
    hero: {
      badge: string;
      titleLine1: string;
      titleLine2: string;
      description: string;
      ctaPrimary: string;
      ctaProjects: string;
      ctaFreelancers: string;
      highlights: {
        commission: string;
        escrow: string;
        access: string;
      };
      features: LandingFeature[];
      visual: {
        dealActive: string;
        escrowAmount: string;
        newBid: string;
        freelancerFound: string;
        reviewsCount: string;
      };
    };
    clients: {
      eyebrow: string;
      title: string;
      benefits: string[];
      cta: string;
    };
    howItWorks: {
      eyebrow: string;
      title: string;
      description: string;
      steps: LandingStep[];
    };
    safety: {
      eyebrow: string;
      title: string;
      description: string;
      clientsTitle: string;
      clientsPoints: string[];
      freelancersTitle: string;
      freelancersPoints: string[];
      visual: {
        escrowFunds: string;
        client: string;
        freelancer: string;
      };
    };
    verified: {
      eyebrow: string;
      title: string;
      description: string;
      benefits: string[];
      cta: string;
      visual: {
        reviewsCountA: string;
        reviewsCountB: string;
      };
    };
    freelancers: {
      eyebrow: string;
      title: string;
      description: string;
      reasons: LandingReason[];
      ctaProjects: string;
      ctaBoost: string;
      visual: {
        newProject: string;
        ratingGrowing: string;
      };
    };
    faq: {
      eyebrow: string;
      title: string;
      descriptionBeforeLink: string;
      contactLink: string;
      descriptionAfterLink: string;
      allLink: string;
    };
    cta: {
      title: string;
      description: string;
      register: string;
      pricing: string;
    };
  };
  common: {
    back: string;
    writeUs: string;
    notFoundAnswer: string;
    found: string;
    foundFiltered: string;
    createAccount: string;
    contactUs: string;
  };
  about: {
    h1: string;
    intro: string;
    clientsTitle: string;
    clientsText: string;
    freelancersTitle: string;
    freelancersText: string;
    securityTitle: string;
    securityText: string;
  };
  faqPage: {
    h1: string;
    introBeforeLink: string;
    introLink: string;
    introAfterLink: string;
  };
  contact: {
    h1: string;
    intro: string;
    supportTitle: string;
    supportEmailLabel: string;
    proSupport: string;
  };
  pricing: {
    h1: string;
    intro: string;
    commissionTitle: string;
    commissionText: string;
  };
  projects: {
    h1: string;
    intro: string;
    emptyTitle: string;
    emptyText: string;
  };
  freelancers: {
    h1: string;
    intro: string;
    emptyTitle: string;
    emptyText: string;
  };
  auth: {
    login: {
      h1: string;
      noAccount: string;
      registerLink: string;
      email: string;
      password: string;
      submit: string;
      loading: string;
      google: string;
      orDivider: string;
      forgotPassword: string;
      errors: {
        invalid: string;
        admin: string;
        session: string;
        config: string;
      };
    };
    register: {
      h1: string;
      hasAccount: string;
      loginLink: string;
      name: string;
      email: string;
      password: string;
      passwordHint: string;
      roleLegend: string;
      role: {
        client: string;
        freelancer: string;
      };
      submit: string;
      loading: string;
      google: string;
      orDivider: string;
      errors: {
        oauthRoleRequired: string;
        invalidRole: string;
        oauth: string;
        emailRegistered: string;
        createFailed: string;
        autoLoginFailed: string;
      };
      agreementPrefix: string;
      terms: string;
      agreementMiddle: string;
      privacy: string;
      agreementSuffix: string;
    };
    demo: {
      title: string;
      clientRole: string;
      freelancerRole: string;
    };
  };
  projectDetail: {
    notFound: {
      title: string;
      description: string;
    };
    common: {
      freelancerFallback: string;
      clientFallback: string;
      newFreelancer: string;
      newClient: string;
      daysShort: string;
      openInMessages: string;
      description: string;
      budget: string;
      published: string;
      views: string;
      bids: string;
      category: string;
      deadlineIn: string;
      deadlineExpired: string;
      dueDate: string;
      management: string;
      editProject: string;
      myProjects: string;
      closeProject: string;
      discussionLocked: string;
      onlyFreelancerCanBid: string;
      bidListHiddenTitle: string;
      bidListHiddenBody: string;
      breadcrumbs: {
        home: string;
        projects: string;
      };
    };
    contractPanel: {
      title: string;
      freelancer: string;
      dealAmount: string;
      escrowStatus: string;
      projectStatus: string;
      platformFee: string;
      freelancerPayout: string;
      clientBalance: string;
      dealCreatedAt: string;
      releaseSuccess: string;
      releaseSubmit: string;
      releasePending: string;
      releaseHint: string;
      disputeSuccess: string;
      disputeSubmit: string;
      disputePending: string;
      escrowActionsHint: string;
      disputeOpenedNotice: string;
      releasedNotice: string;
      refundedNotice: string;
      freelancerPanelTitle: string;
      freelancerPanelClientPrefix: string;
      awaitingFundingNotice: string;
      escrowedNotice: string;
      escrowedHint: string;
      paidNotice: string;
      disputeWaitNotice: string;
    };
    bidForm: {
      successTitle: string;
      successText: string;
      costLabel: string;
      timeframeLabel: string;
      coverLetterLabel: string;
      coverLetterPlaceholder: string;
      coverLetterHint: string;
      submit: string;
      submitting: string;
      loginPromptTitle: string;
      loginPromptTextPrefix: string;
      registerLink: string;
      loginPromptTextSuffix: string;
      loginCta: string;
    };
    bidList: {
      emptyTitle: string;
      emptyBody: string;
      yourBid: string;
      yourCost: string;
      yourTimeframe: string;
      selectedSuccess: string;
      rejectedText: string;
    };
    bidCta: {
      button: string;
    };
    tabs: {
      bids: string;
      discussion: string;
    };
    progress: {
      steps: string[];
    };
    discussion: {
      summaryPrefix: string;
      summaryFallback: string;
    };
    clientStats: {
      title: string;
      completed: string;
      uncompleted: string;
      noHistory: string;
      reviewsCount: string;
      warningsTitle: string;
    };
    acceptBid: {
      success: string;
      pending: string;
      submitPrefix: string;
      hint: string;
    };
    reviews: {
      title: string;
      intro: string;
      allReviews: string;
      clientToFreelancer: string;
      freelancerToClient: string;
      empty: string;
      myReviewDone: string;
      myReviewTitlePrefix: string;
      waitingPartnerPrefix: string;
      waitingPartnerFallback: string;
    };
    featuredBadge: string;
  };
  catalog: {
    projectCard: {
      bidsOne: string;
      bidsFew: string;
      bidsMany: string;
    };
    freelancerCard: {
      freelancerFallback: string;
      projectsCount: string;
      rateSuffix: string;
      hourSuffix: string;
    };
    projectFilters: {
      title: string;
      search: string;
      searchPlaceholder: string;
      category: string;
      allCategories: string;
      minBudget: string;
      maxBudget: string;
      apply: string;
      reset: string;
    };
    freelancerFilters: {
      title: string;
      search: string;
      searchPlaceholder: string;
      skill: string;
      allSkills: string;
      sort: string;
      sortRating: string;
      sortRateAsc: string;
      sortRateDesc: string;
      sortName: string;
      apply: string;
    };
  };
  pricingUi: {
    cards: {
      freeName: string;
      freePeriod: string;
      freeFeatures: string[];
      freeAvailable: string;
      activeBoost: string;
      freeBoostPrice: string;
      freeBoostOffer: string;
      connectPrefix: string;
      roleRestricted: string;
      loginToConnect: string;
    };
    premiumFeatures: {
      title: string;
      intro: string;
      projectTopForDays: string;
      profileFeaturedForDays: string;
    };
  };
  publicForms: {
    contact: {
      success: string;
      name: string;
      email: string;
      message: string;
      submit: string;
      submitting: string;
    };
    password: {
      forgotSuccess: string;
      forgotSubmit: string;
      forgotSubmitting: string;
      backToLogin: string;
      resetSuccess: string;
      resetCta: string;
      newPassword: string;
      minHint: string;
      resetSubmit: string;
      resetSubmitting: string;
      pageForgot: {
        title: string;
        description: string;
      };
      pageReset: {
        title: string;
        invalidToken: string;
        requestNew: string;
      };
    };
  };
  boost: {
    title: string;
    brandName: string;
    tagline: string;
    shortDescription: string;
    heroTitle: string;
    activated: string;
    connect: string;
    paymentSoon: string;
    freePromoOffer: string;
    fillPortfolioCta: string;
    subscriptionLater: string;
    publishProject: string;
    registerFreelancer: string;
    allPricing: string;
    metrics: { value: string; label: string }[];
    featuresTitle: string;
    featuresIntro: string;
    features: { title: string; description: string }[];
    comparisonTitle: string;
    comparisonHeaders: {
      feature: string;
      free: string;
      boost: string;
    };
    comparison: { label: string; free: boolean; boost: boolean }[];
    faqTitle: string;
    faq: { question: string; answer: string }[];
    planFeatures: string[];
    sidebarRole: string;
    pricePerMonth: string;
    pricePerMonthShort: string;
    sidebarActive: string;
    availableForFreelancers: string;
    loginPrefix: string;
    login: string;
    loginMiddle: string;
    register: string;
    loginSuffix: string;
  };
  billing: {
    success: {
      title: string;
      description: string;
      heading: string;
      body: string;
      toCabinet: string;
      finances: string;
    };
    demoTopUp: {
      success: string;
      submit: string;
      loading: string;
      hint: string;
    };
    stripe: {
      checkoutError: string;
      networkError: string;
      loading: string;
    };
  };
  legal: {
    terms: {
      title: string;
      updatedAt: string;
      sections: {
        heading: string;
        body: string;
        bullets?: string[];
      }[];
    };
    privacy: {
      title: string;
      updatedAt: string;
      sections: {
        heading: string;
        body: string;
        bullets?: string[];
      }[];
    };
  };
  freelancerProfile: {
    fallbackName: string;
    portfolioViewWork: string;
    ratingNew: string;
    editProfile: string;
    proposeProject: string;
    hireFreelancer: string;
    stats: {
      rating: string;
      projects: string;
      rate: string;
      experience: string;
      negotiable: string;
      notSpecified: string;
      experienceYear: string;
      experienceFew: string;
      experienceMany: string;
    };
    cooperation: {
      title: string;
      freelanceProjects: string;
      remoteWork: string;
      notSpecified: string;
    };
    languages: string;
    website: string;
    about: {
      title: string;
      empty: string;
    };
    skills: string;
    portfolio: string;
    reviews: string;
  };
  cabinet: {
    soon: string;
    adminCabinet: string;
    adminPanel: string;
    messages: string;
    support: string;
    whatsNew: string;
    more: string;
    profileTab: string;
    mobileMenuTitle: string;
    bottomNavAria: string;
    menuCloseAria: string;
    client: {
      overview: string;
      projects: string;
      work: string;
      finances: string;
      reviews: string;
      personal: string;
      settings: string;
      messages: string;
    };
    freelancer: {
      overview: string;
      work: string;
      bids: string;
      finances: string;
      portfolio: string;
      profile: string;
      reviews: string;
      personal: string;
      settings: string;
      messages: string;
      competitions: string;
      boost: string;
      freelancerProfile: string;
    };
  };
  settings: {
    title: string;
    description: string;
    tabs: {
      service: string;
      security: string;
    };
    emailBanner: string;
    sections: {
      email: string;
      telegram: string;
      telegramHint: string;
      push: string;
      localization: string;
      visual: string;
    };
    email: {
      projectDigest: string;
      newMessages: string;
      serviceInfo: string;
      promotions: string;
      news: string;
      blogDigest: string;
      telegramMessages: string;
      pushBrowser: string;
      pushSoon: string;
      soundMessages: string;
      soundSoon: string;
    };
    localization: {
      preferredLanguage: string;
      autoTranslate: string;
      autoTranslateSoon: string;
      saved: string;
      saveError: string;
    };
    localeOptions: Record<AppLocale, string>;
    theme: {
      light: string;
      dark: string;
      darkSoon: string;
    };
    save: string;
    saving: string;
    saved: string;
    security: {
      password: string;
      passwordHint: string;
      changePassword: string;
      twoFactor: string;
      twoFactorSoon: string;
      twoFactorHint: string;
      sessions: string;
      sessionsHint: string;
      personalData: string;
      personalDataLink: string;
      account: string;
    };
  };
  externalLeave: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    subtitle: string;
    destinationLabel: string;
    proceed: string;
    stay: string;
    remember: string;
    redirecting: string;
    tips: string[];
  };
  footer: {
    tagline: string;
    platform: string;
    company: string;
    legal: string;
    links: {
      projects: string;
      freelancers: string;
      pricing: string;
      about: string;
      faq: string;
      contact: string;
      terms: string;
      privacy: string;
    };
  };
  header: {
    findFreelancer: string;
    findFreelancerShort: string;
    login: string;
    register: string;
    tagline: string;
    homeAria: string;
    myTasks: string;
    myProjectsInProgress: string;
    noActiveProjectsSr: string;
    competitions: string;
    findProject: string;
    freelancers: string;
    newProject: string;
    messages: string;
    messagesUnread: string;
    notifications: string;
    notificationsUnread: string;
    languageAria: string;
    languagePickerAria: string;
    menuTitle: string;
    menuNavAria: string;
    menuOpenAria: string;
    menuCloseAria: string;
  };
  profileMenu: {
    ariaLabel: string;
    myCabinet: string;
    portfolio: string;
    freelancerProfile: string;
    projects: string;
    finances: string;
    whatsNew: string;
    personal: string;
    settings: string;
    adminCabinet: string;
    adminPanel: string;
    logout: string;
    roles: {
      freelancer: string;
      client: string;
      admin: string;
    };
    defaultNames: {
      freelancer: string;
      client: string;
      admin: string;
    };
  };
  popovers: {
    unreadShort: string;
    messages: {
      title: string;
      emptyTitle: string;
      emptyBody: string;
      participant: string;
      viewAll: string;
    };
    notifications: {
      title: string;
      emptyTitle: string;
      emptyClient: string;
      emptyFreelancer: string;
      viewAll: string;
    };
    tasks: {
      title: string;
      heading: string;
      client: string;
      viewAll: string;
      emptyTitle: string;
      emptyBodyPrefix: string;
      emptySearchWork: string;
      emptyContests: string;
      emptyBodyMiddle: string;
    };
  };
  backNav: {
    cabinet: string;
    back: string;
    myProjects: string;
    messages: string;
    personalData: string;
    profile: string;
    toProject: string;
    jobSearch: string;
    freelancerCatalog: string;
  };
  time: {
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  };
  labels: {
    participant: string;
    client: string;
    freelancer: string;
    contractStatus: {
      AWAITING_FUNDING: string;
      ESCROWED: string;
      RELEASED: string;
      REFUNDED: string;
    };
    notificationType: {
      PROJECT_MATCH: string;
      BID_ACCEPTED: string;
      BID_MESSAGE: string;
      NEW_MESSAGE: string;
      NEW_BID: string;
    };
    projectStatus: {
      OPEN: string;
      IN_PROGRESS: string;
      CLOSED: string;
      UNDER_DISPUTE: string;
    };
    bidStatus: {
      PENDING: string;
      ACCEPTED: string;
      REJECTED: string;
    };
  };
  pages: {
    messages: { title: string; intro: string };
    notifications: {
      title: string;
      introClient: string;
      introFreelancer: string;
    };
    freelancer: {
      overview: {
        title: string;
        intro: string;
        findProject: { title: string; desc: string };
        myTasks: { title: string; desc: string };
        myBids: { title: string; desc: string };
        messages: { title: string; desc: string };
        finances: { title: string; desc: string };
        portfolio: { title: string; desc: string };
      };
      work: {
        title: string;
        intro: string;
        emptyTitle: string;
        emptyBody: string;
        clientLabel: string;
      };
      bids: { title: string; intro: string };
      finances: { title: string; intro: string };
      portfolio: { title: string; intro: string };
      profile: { title: string; intro: string };
      personal: { title: string; intro: string };
      reviews: { title: string; intro: string };
    };
    client: {
      overview: {
        title: string;
        intro: string;
        newProject: { title: string; desc: string };
        myProjects: { title: string; desc: string };
        inWork: { title: string; desc: string };
        messages: { title: string; desc: string };
        finances: { title: string; desc: string };
        freelancers: { title: string; desc: string };
      };
      work: {
        title: string;
        intro: string;
        emptyTitle: string;
        emptyBody: string;
        goProjects: string;
        freelancerLabel: string;
      };
      projects: {
        title: string;
        intro: string;
        newProject: string;
        newPage: {
          title: string;
          intro: string;
          noCategories: string;
        };
        editPage: { title: string };
      };
      finances: { title: string; intro: string };
      personal: { title: string; intro: string };
      reviews: { title: string; intro: string };
    };
  };
  inbox: {
    emptyTitle: string;
    emptyBody: string;
    deleteSelected: string;
    searchPlaceholder: string;
    filterProjects: string;
    attachments: string;
    favorites: string;
    sender: string;
    subject: string;
    messageCount: string;
    sent: string;
    selectAll: string;
    noResults: string;
    conversation: string;
    unreadShort: string;
    selectConversation: string;
    chatWith: string;
    participantFallback: string;
    allConversations: string;
    bookmarks: string;
    projectLink: string;
    deleteConversation: string;
    delete: string;
    deleting: string;
    deleteConfirmOne: string;
    deleteConfirmMany: string;
    conversationPageTitle: string;
    conversationPageDescription: string;
    thread: {
      emptyTitle: string;
      emptyBody: string;
      you: string;
      participant: string;
      adminBadge: string;
      placeholder: string;
      attachFiles: string;
      send: string;
      sending: string;
    };
    bidThread: {
      toggleWithCount: string;
      toggleWrite: string;
      emptyBody: string;
      placeholder: string;
      send: string;
      sending: string;
    };
    moderation: {
      adminLabel: string;
      externalContactBlocked: string;
      policyHint: string;
    };
    dispute: {
      openedTitle: string;
      openedBy: string;
      openedByYou: string;
      adminNoteTitle: string;
      adminNoteFrom: string;
      openButton: string;
      dialogTitle: string;
      dialogBody: string;
      reasonLabel: string;
      reasonPlaceholder: string;
      reasonHint: string;
      submit: string;
      pending: string;
      cancel: string;
      success: string;
      openHint: string;
      activeNotice: string;
      freelancerPayoutTitle: string;
      clientPays: string;
      platformFee: string;
      freelancerReceives: string;
    };
  };
  tables: {
    bids: {
      emptyTitle: string;
      emptyBody: string;
      findProject: string;
      filterActive: string;
      filterAll: string;
      countOne: string;
      countFew: string;
      countMany: string;
      noActive: string;
      showAll: string;
      colProject: string;
      colBudget: string;
      colAdded: string;
      colOffer: string;
      budgetLabel: string;
      budgetUnset: string;
      dayOne: string;
      dayFew: string;
      dayMany: string;
    };
    projects: {
      emptyTitle: string;
      emptyBody: string;
      createProject: string;
      colProject: string;
      colCategory: string;
      colBudget: string;
      colStatus: string;
      colBids: string;
      colFreelancer: string;
      colCreated: string;
      colActions: string;
      view: string;
      edit: string;
      noFreelancer: string;
    };
  };
  notificationsPage: {
    emptyTitle: string;
    emptyClient: string;
    emptyFreelancer: string;
    goProjects: string;
    goProfile: string;
    unreadCount: string;
    allRead: string;
    markAllRead: string;
  };
  cabinetForms: {
    common: {
      save: string;
      saving: string;
      saved: string;
      cancel: string;
      notSelected: string;
      optional: string;
      user: string;
      soon: string;
      addTranslation: string;
      bold: string;
      italic: string;
      list: string;
      link: string;
    };
    personalData: {
      tabs: {
        data: string;
        photo: string;
        contacts: string;
        payment: string;
      };
      cooperationTitle: string;
      cooperationDescription: string;
      wantsFreelanceProjects: string;
      wantsRemoteWork: string;
      accountParamsTitle: string;
      login: string;
      profileType: string;
      clientRoleHintBefore: string;
      clientRoleHintLink: string;
      clientRoleHintAfter: string;
      languagesTitle: string;
      removeLanguage: string;
      addLanguage: string;
      personalInfoTitle: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      country: string;
      city: string;
      cityPlaceholder: string;
      photoTitle: string;
      photoDescriptionClient: string;
      photoDescriptionFreelancer: string;
      photoLabel: string;
      chooseFile: string;
      removePhoto: string;
      fileHint: string;
      contactsTitle: string;
      contactsDescription: string;
      email: string;
      phone: string;
      paymentTitle: string;
      paymentDescriptionClient: string;
      paymentDescriptionFreelancer: string;
      paymentUnderDevelopment: string;
      paymentSoonClient: string;
      paymentSoonFreelancer: string;
      goFinancesClient: string;
      goFinancesFreelancer: string;
    };
    freelancerProfile: {
      tabs: {
        about: string;
        specialization: string;
        legal: string;
        extra: string;
      };
      publicProfile: string;
      statusTitle: string;
      statusDescription: string;
      bioTitle: string;
      bioDescription: string;
      bioLanguage: string;
      bioPlaceholder: string;
      bioHint: string;
      specializationTitle: string;
      specializationDescription: string;
      profileTitle: string;
      profileTitlePlaceholder: string;
      hourlyRate: string;
      skills: string;
      skillsEmpty: string;
      legalTitle: string;
      legalDescription: string;
      taxId: string;
      taxIdPlaceholder: string;
      extraTitle: string;
      extraDescription: string;
      website: string;
      experienceYears: string;
    };
    finances: {
      ledger: {
        balanceTopUp: string;
        projectPayment: string;
        projectEscrow: string;
      };
      freelancer: {
        tabs: {
          balance: string;
          withdrawals: string;
          statistics: string;
        };
        securityBannerBefore: string;
        securityBannerLink: string;
        securityBannerAfter: string;
        availableToWithdraw: string;
        availableHint: string;
        escrow: string;
        escrowHintActive: string;
        escrowHintEmpty: string;
        totalEarned: string;
        totalEarnedHint: string;
        escrowInfo1: string;
        escrowInfoBeforeLink: string;
        escrowInfoLink: string;
        escrowInfoAfterLink: string;
        requestWithdrawal: string;
        withdrawalSoon: string;
        colDate: string;
        colCredit: string;
        colDescription: string;
        colAmount: string;
        emptyLedger: string;
        awaitingCompletion: string;
        yearTotal: string;
        activeMonths: string;
        monthlyIncome: string;
        projectsLegend: string;
        colPeriod: string;
        colProjects: string;
        yearTotalRow: string;
      };
      client: {
        balance: string;
        balanceHint: string;
        escrow: string;
        escrowHintActive: string;
        escrowHintEmpty: string;
        totalSpent: string;
        totalSpentHint: string;
        topUpTitle: string;
        topUpDescription: string;
        historyTitle: string;
        emptyHistory: string;
        yearlyExpenses: string;
        projectOne: string;
        projectMany: string;
      };
    };
    reviews: {
      tabs: {
        pending: string;
        received: string;
        given: string;
      };
      stats: {
        rating: string;
        received: string;
        pending: string;
      };
      emptyPending: string;
      ratePartner: string;
      completedAt: string;
      emptyReceived: string;
      emptyGiven: string;
      givenReviewPrefix: string;
      form: {
        ratingAria: string;
        rateTarget: string;
        comment: string;
        commentPlaceholder: string;
        submitting: string;
        submit: string;
        successThanks: string;
      };
      list: {
        emptyDefault: string;
        projectPrefix: string;
        starsOf5: string;
      };
    };
    portfolio: {
      deleteWork: string;
      openProject: string;
      addTitle: string;
      addDescription: string;
      fieldTitle: string;
      fieldTitlePlaceholder: string;
      fieldDescription: string;
      fieldDescriptionPlaceholder: string;
      fieldImageUrl: string;
      fieldImageFile: string;
      fieldImageFileHint: string;
      fieldImageUrlOptional: string;
      fieldProjectUrl: string;
      adding: string;
      addButton: string;
      addedSuccess: string;
      countWorks: string;
      emptyCount: string;
      viewAsClient: string;
      emptyTitle: string;
      emptyDescription: string;
    };
    projectForm: {
      title: string;
      titlePlaceholder: string;
      category: string;
      selectCategory: string;
      description: string;
      editor: string;
      preview: string;
      previewEmpty: string;
      descriptionPlaceholder: string;
      descriptionHint: string;
      budget: string;
      currency: string;
      currencyHint: string;
      budgetNegotiable: string;
      deadline: string;
      optional: string;
      publishing: string;
      publish: string;
    };
    projectEdit: {
      featuredUntil: string;
      boostTitle: string;
      boostDescription: string;
      boostButton: string;
      title: string;
      category: string;
      description: string;
      editor: string;
      preview: string;
      deadline: string;
      saving: string;
      saved: string;
      closeTitle: string;
      closeDescription: string;
    };
    closeProject: {
      confirm: string;
      defaultLabel: string;
      closing: string;
      closed: string;
    };
    balanceTopUp: {
      amountLabel: string;
      topUp: string;
      stripeHint: string;
    };
    escrowNotice: {
      fundedFreelancerTitle: string;
      fundedFreelancerBody: string;
      awaitingClientTitle: string;
      awaitingFreelancerTitle: string;
      awaitingClientBody: string;
      awaitingFreelancerBody: string;
    };
    fundContract: {
      success: string;
      title: string;
      description: string;
      yourBalance: string;
      toFund: string;
      submit: string;
      processing: string;
      insufficient: string;
      payStripe: string;
      goFinances: string;
    };
    options: {
      roles: {
        FREELANCER: string;
        CLIENT: string;
        ADMIN: string;
      };
      languageLevels: {
        NATIVE: string;
        ADVANCED: string;
        INTERMEDIATE: string;
        BASIC: string;
      };
      languages: {
        ru: string;
        uk: string;
        en: string;
        pl: string;
        de: string;
        fr: string;
        es: string;
      };
      countries: {
        UA: string;
        PL: string;
        DE: string;
        US: string;
        GB: string;
        OTHER: string;
      };
      workAvailability: {
        AVAILABLE: { label: string; hint: string };
        SLIGHTLY_BUSY: { label: string; hint: string };
        VERY_BUSY: { label: string; hint: string };
        NOT_WORKING: { label: string; hint: string };
        ON_VACATION: { label: string; hint: string };
      };
      legalStatus: {
        INDIVIDUAL: string;
        SELF_EMPLOYED: string;
        COMPANY: string;
      };
      reviewTarget: {
        freelancer: string;
        client: string;
        other: string;
      };
      reviewerRoles: {
        CLIENT: string;
        FREELANCER: string;
        ADMIN: string;
      };
      ledgerDirection: {
        credit: string;
        debit: string;
        hold: string;
      };
    };
  };
  actionErrors: {
    AUTH_REQUIRED: string;
    CLIENTS_ONLY_PUBLISH: string;
    FREELANCERS_ONLY: string;
    INVALID_CURRENCY: string;
    TITLE_TOO_SHORT: string;
    DESCRIPTION_TOO_SHORT: string;
    CATEGORY_REQUIRED: string;
    CATEGORY_NOT_FOUND: string;
    BUDGET_OR_NEGOTIABLE_REQUIRED: string;
    BUDGET_MUST_BE_POSITIVE: string;
    INVALID_DEADLINE: string;
    DEADLINE_IN_PAST: string;
    REQUIRED_FIELDS_MISSING: string;
    PROJECT_NOT_FOUND: string;
    ACCESS_DENIED: string;
    EDIT_OPEN_PROJECT_ONLY: string;
    CLOSE_OPEN_PROJECT_ONLY: string;
    CANNOT_CLOSE_WITH_FREELANCER: string;
    CANNOT_BID_CLOSED_PROJECT: string;
    CANNOT_BID_OWN_PROJECT: string;
    INVALID_BID_AMOUNT: string;
    INVALID_BID_DAYS: string;
    COVER_LETTER_TOO_SHORT: string;
    ALREADY_BID: string;
    BID_NOT_FOUND: string;
    CLIENTS_ONLY: string;
    PROJECT_ACCESS_DENIED: string;
    ACCEPT_FREELANCER_OPEN_ONLY: string;
    FREELANCER_ALREADY_SELECTED: string;
    BID_ALREADY_PROCESSED: string;
    INVALID_BID_AMOUNT_CONTRACT: string;
    ACCEPT_FREELANCER_FAILED: string;
    CONTRACT_NOT_FOUND: string;
    PROJECT_NOT_IN_PROGRESS: string;
    ESCROW_ALREADY_FUNDED: string;
    FUNDS_ALREADY_PROCESSED: string;
    DEMO_TOPUP_PRODUCTION_ONLY: string;
    USE_STRIPE_FOR_TOPUP: string;
    MESSAGE_REQUIRED: string;
    DISPUTE_REASON_REQUIRED: string;
    DISPUTE_REASON_TOO_SHORT: string;
    MESSAGE_EXTERNAL_CONTACT_BLOCKED: string;
    CONVERSATION_NOT_FOUND: string;
    SELECT_CONVERSATIONS: string;
    CONVERSATIONS_NOT_FOUND: string;
    BID_CHAT_BEFORE_SELECTION: string;
    PROJECT_NOT_ACCEPTING_BIDS: string;
    CLIENT_HAS_NOT_STARTED_CHAT: string;
    EMAIL_REQUIRED: string;
    INVALID_RESET_LINK: string;
    NAME_REQUIRED: string;
    INVALID_BIRTH_DATE: string;
    LANGUAGE_LEVEL_REQUIRED: string;
    DUPLICATE_LANGUAGE: string;
    USER_NOT_FOUND: string;
    FILE_REQUIRED: string;
    FILE_TOO_LARGE: string;
    IMAGE_INVALID_TYPE: string;
    IMAGE_STORAGE_NOT_CONFIGURED: string;
    SELECT_STATUS: string;
    INVALID_RATE: string;
    LEGAL_STATUS_REQUIRED: string;
    EXPERIENCE_RANGE: string;
    PORTFOLIO_TITLE_REQUIRED: string;
    ITEM_NOT_FOUND: string;
    RATING_RANGE: string;
    REVIEW_AFTER_COMPLETION_ONLY: string;
    REVIEW_ALREADY_SUBMITTED: string;
    THEME_REQUIRED: string;
    CONTACT_ALL_FIELDS: string;
    CONTACT_MESSAGE_TOO_SHORT: string;
    CONTACT_MESSAGE_TOO_LONG: string;
    RATE_LIMIT_EXCEEDED: string;
    NOTIFICATION_NOT_FOUND: string;
    REPORT_REASON_REQUIRED: string;
    REPORT_DETAILS_REQUIRED: string;
    REPORT_ALREADY_SUBMITTED: string;
    CANNOT_REPORT_SELF: string;
    ACCOUNT_BANNED: string;
  };
  reports: {
    reportProject: string;
    reportUser: string;
    reportShort: string;
    alreadyReported: string;
    alreadyReportedShort: string;
    loginToReport: string;
    dialogHint: string;
    reasonLabel: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    ownerHiddenNotice: string;
    ownerReportsNotice: string;
    ownerUnderpricedNotice: string;
    emptyPrompt: string;
    bar: {
      underpriced: string;
      hot: string;
      general: string;
    };
    flag: {
      underpriced: string;
      underpricedHot: string;
      general: string;
    };
    reasons: {
      UNDERPRICED: string;
      SPAM: string;
      FRAUD: string;
      HARASSMENT: string;
      IRRELEVANT: string;
      POLICY_VIOLATION: string;
      FAKE_PROFILE: string;
      OTHER: string;
    };
  };
  cookies: {
    title: string;
    bodyBeforeLink: string;
    privacyLink: string;
    bodyAfterLink: string;
    essentialOnly: string;
    acceptAll: string;
  };
  notificationTemplates: {
    PROJECT_MATCH: { title: string; body: string };
    BID_ACCEPTED: { title: string; body: string };
    BID_MESSAGE: { title: string; body: string };
    NEW_MESSAGE: { title: string; body: string };
    NEW_BID: { title: string; body: string };
  };
  faq: FaqItem[];
};
