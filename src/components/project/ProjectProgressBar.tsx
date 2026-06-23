"use client";

import {
  PROJECT_LIFECYCLE_STEPS,
  getProjectLifecycleStep,
} from "@/lib/project-progress";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import type { ContractStatus, ProjectStatus } from "@/generated/prisma/client";

type ProjectProgressBarProps = {
  status: ProjectStatus;
  contractStatus?: ContractStatus | null;
};

export function ProjectProgressBar({
  status,
  contractStatus,
}: ProjectProgressBarProps) {
  const dict = useDictionary();
  const activeStep = getProjectLifecycleStep(status, contractStatus);

  return (
    <div className="overflow-x-auto">
      <ol className="flex min-w-[640px]">
        {PROJECT_LIFECYCLE_STEPS.map((step, index) => {
          const isCompleted = index < activeStep;
          const isCurrent = index === activeStep;
          const isLast = index === PROJECT_LIFECYCLE_STEPS.length - 1;

          const stepClassName = isCompleted
            ? "bg-emerald-500 text-white"
            : isCurrent
              ? "bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400 ring-inset"
              : "bg-zinc-100 text-zinc-500";

          return (
            <li
              key={step.id}
              className={`relative flex flex-1 items-center ${
                isLast ? "" : "pr-2"
              }`}
            >
              <div
                className={`flex h-10 w-full items-center justify-center px-3 text-center text-xs font-semibold sm:text-sm ${stepClassName} ${index === 0 ? "rounded-l-lg" : ""} ${
                  isLast ? "rounded-r-lg" : ""
                }`}
                style={
                  !isLast
                    ? {
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)",
                      }
                    : undefined
                }
              >
                <span className="truncate">
                  {dict.projectDetail.progress.steps[index] ?? step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
