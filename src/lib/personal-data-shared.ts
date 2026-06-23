export type PersonalDataTab = "data" | "photo" | "contacts" | "payment";

export type LanguageLevel = "NATIVE" | "ADVANCED" | "INTERMEDIATE" | "BASIC";

export type UserLanguageRow = {
  id: string;
  language: string;
  level: LanguageLevel;
};

export type PersonalDataForm = {
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  country: string | null;
  city: string | null;
  phone: string | null;
  avatar: string | null;
  wantsFreelanceProjects: boolean;
  wantsRemoteWork: boolean;
  languages: UserLanguageRow[];
  payoutMethod: "CARD" | "IBAN" | null;
  payoutDestination: string | null;
  payoutHolderName: string | null;
  stripeConnectEnabled: boolean;
  stripeConnectAccountLinked: boolean;
  stripeConnectPayoutsEnabled: boolean;
};

export const LANGUAGE_OPTIONS = [
  { value: "ru", label: "Русский" },
  { value: "uk", label: "Украинский" },
  { value: "en", label: "Английский" },
  { value: "pl", label: "Польский" },
  { value: "de", label: "Немецкий" },
  { value: "fr", label: "Французский" },
  { value: "es", label: "Испанский" },
] as const;

export const LANGUAGE_LEVEL_OPTIONS: { value: LanguageLevel; label: string }[] = [
  { value: "NATIVE", label: "Родной / свободный" },
  { value: "ADVANCED", label: "Продвинутый" },
  { value: "INTERMEDIATE", label: "Средний" },
  { value: "BASIC", label: "Базовый" },
];

export const COUNTRY_OPTIONS = [
  { value: "UA", label: "Украина" },
  { value: "PL", label: "Польша" },
  { value: "DE", label: "Германия" },
  { value: "US", label: "США" },
  { value: "GB", label: "Великобритания" },
  { value: "OTHER", label: "Другая" },
] as const;

export const ROLE_LABELS: Record<string, string> = {
  FREELANCER: "Фрилансер",
  CLIENT: "Заказчик",
  ADMIN: "Администратор",
};

export function languageLabel(code: string): string {
  return LANGUAGE_OPTIONS.find((item) => item.value === code)?.label ?? code;
}

export function levelLabel(level: LanguageLevel): string {
  return LANGUAGE_LEVEL_OPTIONS.find((item) => item.value === level)?.label ?? level;
}

export function countryLabel(code: string | null): string {
  if (!code) return "";
  return COUNTRY_OPTIONS.find((item) => item.value === code)?.label ?? code;
}
