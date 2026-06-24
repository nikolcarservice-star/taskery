import type { AdminAuditAction } from "@/generated/prisma/client";

export type AdminAuditEntry = {
  id: string;
  action: AdminAuditAction;
  targetType: string | null;
  targetId: string | null;
  details: unknown;
  createdAt: string;
  admin: { id: string; name: string | null; email: string };
};

export const ADMIN_AUDIT_ACTION_LABELS: Record<AdminAuditAction, string> = {
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
