export type FreelancerProfileTab =
  | "about"
  | "specialization"
  | "legal"
  | "extra";

export type WorkAvailability =
  | "AVAILABLE"
  | "SLIGHTLY_BUSY"
  | "VERY_BUSY"
  | "NOT_WORKING"
  | "ON_VACATION";

export type LegalStatus = "INDIVIDUAL" | "SELF_EMPLOYED" | "COMPANY";

export type SkillOption = { id: string; name: string };

export type FreelancerProfileData = {
  userId: string;
  bio: string | null;
  workAvailability: WorkAvailability;
  title: string | null;
  hourlyRate: string | null;
  skillIds: string[];
  legalStatus: LegalStatus | null;
  taxId: string | null;
  website: string | null;
  experienceYears: number | null;
};

export const WORK_AVAILABILITY_OPTIONS: {
  value: WorkAvailability;
  label: string;
  hint: string;
}[] = [
  {
    value: "AVAILABLE",
    label: "Свободен для работы",
    hint: "Готов принимать новые проекты",
  },
  {
    value: "SLIGHTLY_BUSY",
    label: "Немного занят",
    hint: "Есть время на небольшие задачи",
  },
  {
    value: "VERY_BUSY",
    label: "Сильно занят",
    hint: "Новые проекты только по договорённости",
  },
  {
    value: "NOT_WORKING",
    label: "Временно не работаю",
    hint: "Не принимаю заказы",
  },
  {
    value: "ON_VACATION",
    label: "В отпуске",
    hint: "Вернусь позже — ответы могут задерживаться",
  },
];

export const LEGAL_STATUS_OPTIONS: { value: LegalStatus; label: string }[] = [
  { value: "INDIVIDUAL", label: "Физическое лицо" },
  { value: "SELF_EMPLOYED", label: "Самозанятый / ФОП" },
  { value: "COMPANY", label: "Компания" },
];

export const WORK_AVAILABILITY_LABELS: Record<WorkAvailability, string> = {
  AVAILABLE: "Свободен",
  SLIGHTLY_BUSY: "Немного занят",
  VERY_BUSY: "Сильно занят",
  NOT_WORKING: "Не работаю",
  ON_VACATION: "В отпуске",
};

export const WORK_AVAILABILITY_COLORS: Record<WorkAvailability, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-800",
  SLIGHTLY_BUSY: "bg-amber-100 text-amber-800",
  VERY_BUSY: "bg-orange-100 text-orange-800",
  NOT_WORKING: "bg-zinc-100 text-zinc-600",
  ON_VACATION: "bg-sky-100 text-sky-800",
};
