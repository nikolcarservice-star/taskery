"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { ActiveTasksPopover } from "@/components/ActiveTasksPopover";
import { headerNavLinkClass } from "@/components/HeaderShell";
import { NoActiveTasksPopover } from "@/components/NoActiveTasksPopover";
import { useNoActiveTasksHint } from "@/components/NoActiveTasksHintProvider";
import type { ActiveTaskPreview } from "@/lib/tasks-shared";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type MyTasksNavLinkProps = {
  tasks: ActiveTaskPreview[];
};

const CLOSE_DELAY_MS = 200;

export function MyTasksNavLink({ tasks }: MyTasksNavLinkProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const hasActiveTasks = tasks.length > 0;
  const hint = useNoActiveTasksHint();
  const [hoverOpen, setHoverOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPopover = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setHoverOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setHoverOpen(false);
      hint?.closePageHint();
    }, CLOSE_DELAY_MS);
  }, [hint]);

  useEffect(() => {
    if (hasActiveTasks) {
      hint?.closePageHint();
    }
  }, [hasActiveTasks, hint]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const showPopover = hoverOpen || (!hasActiveTasks && (hint?.pageHintOpen ?? false));

  return (
    <div className="relative">
      <Link
        href={l("/dashboard/work")}
        className={headerNavLinkClass}
        aria-expanded={showPopover}
        onMouseEnter={openPopover}
        onMouseLeave={scheduleClose}
        onFocus={openPopover}
        onBlur={scheduleClose}
      >
        {dict.header.myTasks}
      </Link>

      {showPopover && (
        <div
          className="absolute left-1/2 top-full z-[60] w-[min(360px,calc(100vw-2rem))] -translate-x-1/2 pt-1"
          onMouseEnter={openPopover}
          onMouseLeave={scheduleClose}
        >
          {hasActiveTasks ? (
            <ActiveTasksPopover tasks={tasks} />
          ) : (
            <NoActiveTasksPopover />
          )}
        </div>
      )}
    </div>
  );
}
