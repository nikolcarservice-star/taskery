import type { SupportedCurrency } from "@/lib/i18n/currencies";
import { prisma } from "@/lib/prisma";

export type CategoryMinBudgetRow = {
  currency: SupportedCurrency;
  minAmount: number;
};

export async function getCategoryMinBudgets(
  categoryId: string,
): Promise<CategoryMinBudgetRow[]> {
  const rows = await prisma.categoryMinBudget.findMany({
    where: { categoryId },
    orderBy: { currency: "asc" },
  });

  return rows.map((row) => ({
    currency: row.currency as SupportedCurrency,
    minAmount: Number(row.minAmount),
  }));
}

export async function validateCategoryMinBudget(
  categoryId: string,
  currency: string,
  budget: number | null,
): Promise<
  | { ok: true }
  | { ok: false; minAmount: number; currency: SupportedCurrency }
> {
  if (budget === null) {
    return { ok: true };
  }

  const row = await prisma.categoryMinBudget.findUnique({
    where: {
      categoryId_currency: { categoryId, currency },
    },
    select: { minAmount: true, currency: true },
  });

  if (!row) {
    return { ok: true };
  }

  const minAmount = Number(row.minAmount);
  if (budget >= minAmount) {
    return { ok: true };
  }

  return {
    ok: false,
    minAmount,
    currency: row.currency as SupportedCurrency,
  };
}
