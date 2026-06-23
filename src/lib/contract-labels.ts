import { ContractStatus } from "@/generated/prisma/client";

export const contractStatusLabels: Record<ContractStatus, string> = {
  AWAITING_FUNDING: "Ожидает внесения средств",
  ESCROWED: "Средства в эскроу",
  RELEASED: "Выплачено исполнителю",
  REFUNDED: "Возвращено заказчику",
};

export const contractStatusColors: Record<ContractStatus, string> = {
  AWAITING_FUNDING: "bg-orange-100 text-orange-800",
  ESCROWED: "bg-amber-100 text-amber-800",
  RELEASED: "bg-green-100 text-green-800",
  REFUNDED: "bg-blue-100 text-blue-800",
};
