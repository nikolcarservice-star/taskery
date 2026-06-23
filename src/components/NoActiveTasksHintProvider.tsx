"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type NoActiveTasksHintContextValue = {
  pageHintOpen: boolean;
  openPageHint: () => void;
  closePageHint: () => void;
};

const NoActiveTasksHintContext =
  createContext<NoActiveTasksHintContextValue | null>(null);

export function useNoActiveTasksHint() {
  return useContext(NoActiveTasksHintContext);
}

type NoActiveTasksHintProviderProps = {
  children: ReactNode;
  enabled: boolean;
};

export function NoActiveTasksHintProvider({
  children,
  enabled,
}: NoActiveTasksHintProviderProps) {
  const [pageHintOpen, setPageHintOpen] = useState(false);

  const openPageHint = useCallback(() => {
    if (enabled) setPageHintOpen(true);
  }, [enabled]);

  const closePageHint = useCallback(() => setPageHintOpen(false), []);

  const value = useMemo(
    () => ({ pageHintOpen, openPageHint, closePageHint }),
    [pageHintOpen, openPageHint, closePageHint],
  );

  return (
    <NoActiveTasksHintContext.Provider value={value}>
      {children}
    </NoActiveTasksHintContext.Provider>
  );
}
