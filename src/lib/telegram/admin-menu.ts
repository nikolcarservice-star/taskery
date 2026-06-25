import { hasAdminPermission } from "@/lib/admin-permissions";
import { formatMoney } from "@/lib/i18n/currencies";
import { prisma } from "@/lib/prisma";
import {
  getAdminMobileBadges,
  type AdminMobileBadges,
} from "@/lib/queries/admin-mobile-badges";
import {
  getPendingModerationProjectCount,
  getPendingModerationProjects,
} from "@/lib/queries/admin-pending-projects";
import {
  getPendingWithdrawals,
  getPendingWithdrawalCount,
} from "@/lib/queries/admin-withdrawals";
import { siteConfig } from "@/lib/seo";
import type { ResolvedAdmin } from "@/lib/telegram/resolve";
import type { TelegramInlineButton } from "@/lib/telegram/types";

export const ADMIN_MENU_PAGE_SIZE = 5;

export type AdminMenuPayload = {
  text: string;
  keyboard: TelegramInlineButton[][];
};

type AdminProfile = {
  name: string | null;
  alertsEnabled: boolean;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function adminUrl(path: string): string {
  return path.startsWith("http") ? path : `${siteConfig.url}${path}`;
}

function badge(count: number): string {
  return count > 0 ? ` (${count})` : "";
}

function backRow(target = "m:main"): TelegramInlineButton[] {
  return [{ text: "← Главное меню", callback_data: target }];
}

function navRow(...buttons: TelegramInlineButton[]): TelegramInlineButton[] {
  return buttons;
}

async function loadAdminProfile(adminId: string): Promise<AdminProfile> {
  const user = await prisma.user.findUnique({
    where: { id: adminId },
    select: {
      name: true,
      settings: { select: { adminTelegramAlerts: true } },
    },
  });
  return {
    name: user?.name ?? null,
    alertsEnabled: user?.settings?.adminTelegramAlerts ?? true,
  };
}

async function loadBadges(admin: ResolvedAdmin): Promise<AdminMobileBadges> {
  return getAdminMobileBadges(admin.adminPermissions, admin.id);
}

async function loadModerationCounts(admin: ResolvedAdmin) {
  if (!hasAdminPermission(admin.adminPermissions, "MODERATION")) {
    return { pendingProjects: 0, reports: 0, disputes: 0 };
  }

  const [pendingProjects, reports, disputes] = await Promise.all([
    getPendingModerationProjectCount(),
    prisma.report.count({
      where: { status: { in: ["PENDING", "IN_REVIEW"] } },
    }),
    prisma.project.count({ where: { status: "UNDER_DISPUTE" } }),
  ]);

  return { pendingProjects, reports, disputes };
}

export async function buildAdminMainMenu(
  admin: ResolvedAdmin,
): Promise<AdminMenuPayload> {
  const [profile, badges, modCounts] = await Promise.all([
    loadAdminProfile(admin.id),
    loadBadges(admin),
    loadModerationCounts(admin),
  ]);

  const greeting = profile.name
    ? `Привет, <b>${escapeHtml(profile.name)}</b>!`
    : "<b>Taskery Admin</b>";

  const attention: string[] = [];
  if (hasAdminPermission(admin.adminPermissions, "MODERATION")) {
    if (modCounts.pendingProjects > 0) {
      attention.push(`• Проекты на модерации: <b>${modCounts.pendingProjects}</b>`);
    }
    if (modCounts.reports > 0) {
      attention.push(`• Жалобы: <b>${modCounts.reports}</b>`);
    }
    if (modCounts.disputes > 0) {
      attention.push(`• Споры: <b>${modCounts.disputes}</b>`);
    }
  }
  if (
    hasAdminPermission(admin.adminPermissions, "FINANCE") &&
    badges.withdrawals > 0
  ) {
    attention.push(`• Выводы: <b>${badges.withdrawals}</b>`);
  }
  if (
    hasAdminPermission(admin.adminPermissions, "USERS") &&
    badges.verification > 0
  ) {
    attention.push(`• Верификация: <b>${badges.verification}</b>`);
  }

  const attentionBlock =
    attention.length > 0
      ? `\n\n<b>Требует внимания</b>\n${attention.join("\n")}`
      : "\n\n✨ Всё спокойно — срочных задач нет.";

  const alertsLabel = profile.alertsEnabled ? "🔔 Вкл" : "🔕 Выкл";

  const rows: TelegramInlineButton[][] = [];

  if (hasAdminPermission(admin.adminPermissions, "MODERATION")) {
    rows.push([
      {
        text: `🛡️ Модерация${badge(badges.moderation)}`,
        callback_data: "m:mod",
      },
    ]);
  }

  if (hasAdminPermission(admin.adminPermissions, "FINANCE")) {
    rows.push([
      {
        text: `💰 Финансы${badge(badges.withdrawals)}`,
        callback_data: "m:fin",
      },
    ]);
  }

  if (hasAdminPermission(admin.adminPermissions, "USERS")) {
    rows.push([
      {
        text: `👥 Верификация${badge(badges.verification)}`,
        url: adminUrl("/admin/mobile/users"),
      },
    ]);
  }

  rows.push([
    { text: "🌐 Админка", url: adminUrl("/admin/mobile") },
    { text: "🔄 Обновить", callback_data: "m:refresh" },
  ]);

  rows.push([
    { text: `⚙️ Уведомления: ${alertsLabel}`, callback_data: "m:settings" },
  ]);

  return {
    text: `${greeting}${attentionBlock}\n\nВыберите раздел:`,
    keyboard: rows,
  };
}

export async function buildAdminModerationMenu(
  admin: ResolvedAdmin,
): Promise<AdminMenuPayload | { error: string }> {
  if (!hasAdminPermission(admin.adminPermissions, "MODERATION")) {
    return { error: "Недостаточно прав" };
  }

  const counts = await loadModerationCounts(admin);

  const rows: TelegramInlineButton[][] = [
    [
      {
        text: `📋 Проекты${badge(counts.pendingProjects)}`,
        callback_data: "lp:0",
      },
    ],
    [
      {
        text: `🚩 Жалобы${badge(counts.reports)}`,
        callback_data: "m:reports",
      },
      {
        text: `⚖️ Споры${badge(counts.disputes)}`,
        url: adminUrl("/admin/mobile/moderation?section=disputes"),
      },
    ],
    [{ text: "🌐 Модерация в админке", url: adminUrl("/admin/mobile/moderation") }],
    backRow(),
  ];

  return {
    text:
      "<b>🛡️ Модерация</b>\n\n" +
      `Проекты: <b>${counts.pendingProjects}</b>\n` +
      `Жалобы: <b>${counts.reports}</b>\n` +
      `Споры: <b>${counts.disputes}</b>`,
    keyboard: rows,
  };
}

export async function buildAdminFinanceMenu(
  admin: ResolvedAdmin,
): Promise<AdminMenuPayload | { error: string }> {
  if (!hasAdminPermission(admin.adminPermissions, "FINANCE")) {
    return { error: "Недостаточно прав" };
  }

  const [withdrawalCount, escrowCount] = await Promise.all([
    getPendingWithdrawalCount(),
    prisma.contract.count({
      where: { status: { in: ["ESCROWED", "AWAITING_FUNDING"] } },
    }),
  ]);

  const rows: TelegramInlineButton[][] = [
    [
      {
        text: `💸 Выводы${badge(withdrawalCount)}`,
        callback_data: "lw:0",
      },
    ],
    [
      {
        text: `🔒 Эскроу (${escrowCount})`,
        url: adminUrl("/admin/mobile/finance"),
      },
    ],
    [{ text: "🌐 Финансы в админке", url: adminUrl("/admin/mobile/finance") }],
    backRow(),
  ];

  return {
    text:
      "<b>💰 Финансы</b>\n\n" +
      `Заявки на вывод: <b>${withdrawalCount}</b>\n` +
      `Активный эскроу: <b>${escrowCount}</b> сделок`,
    keyboard: rows,
  };
}

export async function buildAdminPendingProjectsList(
  admin: ResolvedAdmin,
  page: number,
): Promise<AdminMenuPayload | { error: string }> {
  if (!hasAdminPermission(admin.adminPermissions, "MODERATION")) {
    return { error: "Недостаточно прав" };
  }

  const projects = await getPendingModerationProjects();
  const total = projects.length;

  if (total === 0) {
    return {
      text: "<b>📋 Проекты на модерации</b>\n\nНет проектов на модерации 🎉",
      keyboard: [backRow("m:mod")],
    };
  }

  const start = page * ADMIN_MENU_PAGE_SIZE;
  const slice = projects.slice(start, start + ADMIN_MENU_PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = start + ADMIN_MENU_PAGE_SIZE < total;

  const rows: TelegramInlineButton[][] = slice.map((project) => [
    {
      text: truncateLabel(project.title, 40),
      callback_data: `pv:${project.id}`,
    },
  ]);

  const nav: TelegramInlineButton[] = [];
  if (hasPrev) {
    nav.push({ text: "◀️ Назад", callback_data: `lp:${page - 1}` });
  }
  if (hasNext) {
    nav.push({ text: "Далее ▶️", callback_data: `lp:${page + 1}` });
  }
  if (nav.length > 0) rows.push(nav);

  rows.push(backRow("m:mod"));

  return {
    text:
      `<b>📋 Проекты на модерации</b> (${total})\n` +
      `Страница ${page + 1} из ${Math.ceil(total / ADMIN_MENU_PAGE_SIZE) || 1}\n\n` +
      "Выберите проект:",
    keyboard: rows,
  };
}

export async function buildAdminWithdrawalsList(
  admin: ResolvedAdmin,
  page: number,
): Promise<AdminMenuPayload | { error: string }> {
  if (!hasAdminPermission(admin.adminPermissions, "FINANCE")) {
    return { error: "Недостаточно прав" };
  }

  const withdrawals = await getPendingWithdrawals("ru");
  const total = withdrawals.length;

  if (total === 0) {
    return {
      text: "<b>💸 Заявки на вывод</b>\n\nНет ожидающих заявок 🎉",
      keyboard: [backRow("m:fin")],
    };
  }

  const start = page * ADMIN_MENU_PAGE_SIZE;
  const slice = withdrawals.slice(start, start + ADMIN_MENU_PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = start + ADMIN_MENU_PAGE_SIZE < total;

  const rows: TelegramInlineButton[][] = slice.map((item) => {
    const amount = formatMoney(Number(item.amount), item.currency);
    const label = `${amount} · ${item.user.name ?? item.user.email}`;
    return [
      {
        text: truncateLabel(label, 40),
        callback_data: `wv:${item.id}`,
      },
    ];
  });

  const nav: TelegramInlineButton[] = [];
  if (hasPrev) {
    nav.push({ text: "◀️ Назад", callback_data: `lw:${page - 1}` });
  }
  if (hasNext) {
    nav.push({ text: "Далее ▶️", callback_data: `lw:${page + 1}` });
  }
  if (nav.length > 0) rows.push(nav);

  rows.push(backRow("m:fin"));

  return {
    text:
      `<b>💸 Заявки на вывод</b> (${total})\n` +
      `Страница ${page + 1} из ${Math.ceil(total / ADMIN_MENU_PAGE_SIZE) || 1}\n\n` +
      "Выберите заявку:",
    keyboard: rows,
  };
}

export async function buildAdminProjectCard(
  admin: ResolvedAdmin,
  projectId: string,
): Promise<AdminMenuPayload | { error: string }> {
  if (!hasAdminPermission(admin.adminPermissions, "MODERATION")) {
    return { error: "Недостаточно прав" };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      title: true,
      status: true,
      slug: true,
      createdAt: true,
      client: { select: { name: true, email: true } },
      category: { select: { name: true } },
    },
  });

  if (!project) {
    return { error: "Проект не найден" };
  }

  if (project.status !== "PENDING_MODERATION") {
    return {
      text:
        `<b>${escapeHtml(project.title)}</b>\n\n` +
        `Статус: <i>${project.status}</i>\n` +
        "Проект уже обработан.",
      keyboard: [backRow("lp:0")],
    };
  }

  const clientName =
    project.client.name ?? project.client.email;
  const date = project.createdAt.toLocaleDateString("ru-RU");
  const category = project.category?.name ?? "—";

  const rows: TelegramInlineButton[][] = [
    navRow(
      { text: "✅ Одобрить", callback_data: `pa:${project.id}` },
      { text: "❌ Отклонить", callback_data: `pr:${project.id}` },
    ),
    [
      {
        text: "🌐 Открыть в админке",
        url: adminUrl("/admin/mobile/moderation?section=projects"),
      },
    ],
    backRow("lp:0"),
  ];

  return {
    text:
      "<b>📋 Проект на модерации</b>\n\n" +
      `<b>${escapeHtml(project.title)}</b>\n` +
      `Клиент: ${escapeHtml(clientName)}\n` +
      `Категория: ${escapeHtml(category)}\n` +
      `Создан: ${date}`,
    keyboard: rows,
  };
}

export async function buildAdminWithdrawalCard(
  admin: ResolvedAdmin,
  paymentId: string,
): Promise<AdminMenuPayload | { error: string }> {
  if (!hasAdminPermission(admin.adminPermissions, "FINANCE")) {
    return { error: "Недостаточно прав" };
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: {
      id: true,
      amount: true,
      currency: true,
      status: true,
      createdAt: true,
      metadata: true,
      user: { select: { name: true, email: true, balance: true } },
    },
  });

  if (!payment || payment.status !== "PENDING") {
    return {
      text: "Заявка не найдена или уже обработана.",
      keyboard: [backRow("lw:0")],
    };
  }

  const amount = formatMoney(Number(payment.amount), payment.currency);
  const balance = formatMoney(Number(payment.user.balance), payment.currency);
  const userName = payment.user.name ?? payment.user.email;
  const date = payment.createdAt.toLocaleDateString("ru-RU");

  const rows: TelegramInlineButton[][] = [
    navRow(
      { text: "✅ Одобрить", callback_data: `wa:${payment.id}` },
      { text: "❌ Отклонить", callback_data: `wr:${payment.id}` },
    ),
    [
      {
        text: "🌐 Открыть в админке",
        url: adminUrl("/admin/mobile/withdrawals"),
      },
    ],
    backRow("lw:0"),
  ];

  return {
    text:
      "<b>💸 Заявка на вывод</b>\n\n" +
      `Сумма: <b>${escapeHtml(amount)}</b>\n` +
      `Пользователь: ${escapeHtml(userName)}\n` +
      `Баланс: ${escapeHtml(balance)}\n` +
      `Дата: ${date}`,
    keyboard: rows,
  };
}

export async function buildAdminReportsScreen(
  admin: ResolvedAdmin,
): Promise<AdminMenuPayload | { error: string }> {
  if (!hasAdminPermission(admin.adminPermissions, "MODERATION")) {
    return { error: "Недостаточно прав" };
  }

  const count = await prisma.report.count({
    where: { status: { in: ["PENDING", "IN_REVIEW"] } },
  });

  const text =
    count === 0
      ? "<b>🚩 Жалобы</b>\n\nНет открытых жалоб 🎉"
      : `<b>🚩 Жалобы</b>\n\nОткрытых жалоб: <b>${count}</b>\n\nОбработка — в админ-панели.`;

  return {
    text,
    keyboard: [
      [{ text: "🌐 Открыть жалобы", url: adminUrl("/admin/mobile/moderation?section=reports") }],
      backRow("m:mod"),
    ],
  };
}

export async function buildAdminSettingsScreen(
  admin: ResolvedAdmin,
): Promise<AdminMenuPayload> {
  const profile = await loadAdminProfile(admin.id);
  const status = profile.alertsEnabled ? "включены" : "выключены";
  const toggleLabel = profile.alertsEnabled
    ? "🔕 Выключить уведомления"
    : "🔔 Включить уведомления";

  return {
    text:
      "<b>⚙️ Настройки</b>\n\n" +
      `Push-уведомления: <b>${status}</b>\n\n` +
      "Уведомления о новых проектах, выводах и жалобах приходят в этот чат.",
    keyboard: [
      [{ text: toggleLabel, callback_data: "m:alerts" }],
      backRow(),
    ],
  };
}

export function buildAdminActionDoneMenu(
  message: string,
): AdminMenuPayload {
  return {
    text: message,
    keyboard: [
      [{ text: "← Главное меню", callback_data: "m:main" }],
      [{ text: "🔄 Обновить", callback_data: "m:refresh" }],
    ],
  };
}

export async function resolveAdminMenuScreen(
  admin: ResolvedAdmin,
  target: string,
): Promise<AdminMenuPayload | { error: string }> {
  if (target === "main" || target === "refresh") {
    return buildAdminMainMenu(admin);
  }
  if (target === "mod") return buildAdminModerationMenu(admin);
  if (target === "fin") return buildAdminFinanceMenu(admin);
  if (target === "reports") return buildAdminReportsScreen(admin);
  if (target === "settings") return buildAdminSettingsScreen(admin);

  if (target.startsWith("lp:")) {
    const page = Number.parseInt(target.slice(3), 10) || 0;
    return buildAdminPendingProjectsList(admin, page);
  }
  if (target.startsWith("lw:")) {
    const page = Number.parseInt(target.slice(3), 10) || 0;
    return buildAdminWithdrawalsList(admin, page);
  }
  if (target.startsWith("pv:")) {
    return buildAdminProjectCard(admin, target.slice(3));
  }
  if (target.startsWith("wv:")) {
    return buildAdminWithdrawalCard(admin, target.slice(3));
  }

  return { error: "Неизвестный экран" };
}

function truncateLabel(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}
