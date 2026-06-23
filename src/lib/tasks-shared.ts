import type { ContractStatus } from "@/generated/prisma/client";

export type ActiveTaskPreview = {
  id: string;
  projectTitle: string;
  projectSlug: string;
  clientName: string | null;
  amount: string;
  currency: string;
  status: ContractStatus;
};
