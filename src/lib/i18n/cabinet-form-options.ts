import type { Role } from "@/generated/prisma/client";
import {
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  type LanguageLevel,
} from "@/lib/personal-data-shared";
import {
  LEGAL_STATUS_OPTIONS,
  WORK_AVAILABILITY_OPTIONS,
  type LegalStatus,
  type WorkAvailability,
} from "@/lib/freelancer-profile-shared";
import type { Dictionary } from "@/lib/i18n/types";

export function getRoleLabel(dict: Dictionary, role: string): string {
  const roles = dict.cabinetForms.options.roles;
  if (role in roles) {
    return roles[role as keyof typeof roles];
  }
  return role;
}

export function getLanguageLevelOptions(dict: Dictionary) {
  const levels = dict.cabinetForms.options.languageLevels;
  return (Object.keys(levels) as LanguageLevel[]).map((value) => ({
    value,
    label: levels[value],
  }));
}

export function getLanguageOptions(dict: Dictionary) {
  const labels = dict.cabinetForms.options.languages;
  return LANGUAGE_OPTIONS.map((option) => ({
    value: option.value,
    label: labels[option.value as keyof typeof labels] ?? option.label,
  }));
}

export function getCountryOptions(dict: Dictionary) {
  const labels = dict.cabinetForms.options.countries;
  return COUNTRY_OPTIONS.map((option) => ({
    value: option.value,
    label: labels[option.value],
  }));
}

export function getWorkAvailabilityOptions(dict: Dictionary) {
  const options = dict.cabinetForms.options.workAvailability;
  return WORK_AVAILABILITY_OPTIONS.map((option) => ({
    value: option.value,
    label: options[option.value].label,
    hint: options[option.value].hint,
  }));
}

export function getLegalStatusOptions(dict: Dictionary) {
  const labels = dict.cabinetForms.options.legalStatus;
  return LEGAL_STATUS_OPTIONS.map((option) => ({
    value: option.value,
    label: labels[option.value],
  }));
}

export function reviewTargetLabel(dict: Dictionary, partnerRole: Role): string {
  const targets = dict.cabinetForms.options.reviewTarget;
  if (partnerRole === "FREELANCER") return targets.freelancer;
  if (partnerRole === "CLIENT") return targets.client;
  return targets.other;
}

export function getReviewerRoleLabel(dict: Dictionary, role: Role): string {
  const roles = dict.cabinetForms.options.reviewerRoles;
  if (role in roles) {
    return roles[role as keyof typeof roles];
  }
  return role;
}

export function getLedgerDirectionLabel(
  dict: Dictionary,
  direction: "credit" | "debit" | "hold",
): string {
  return dict.cabinetForms.options.ledgerDirection[direction];
}

export function getWorkAvailabilityLabel(
  dict: Dictionary,
  value: WorkAvailability,
): string {
  return dict.cabinetForms.options.workAvailability[value].label;
}

export function getLegalStatusLabel(dict: Dictionary, value: LegalStatus): string {
  return dict.cabinetForms.options.legalStatus[value];
}
