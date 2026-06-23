"use client";

import { useNoActiveTasksHint } from "@/components/NoActiveTasksHintProvider";
import { useEffect } from "react";

export function MyTasksEmptyTrigger() {
  const hint = useNoActiveTasksHint();

  useEffect(() => {
    hint?.openPageHint();
  }, [hint]);

  return null;
}
