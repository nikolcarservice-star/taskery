"use client";

import type { AppLocale, Dictionary } from "@/lib/i18n/types";
import { createContext, useContext } from "react";

type DictionaryContextValue = {
  locale: AppLocale;
  dict: Dictionary;
};

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export function DictionaryProvider({
  locale,
  dict,
  children,
}: {
  locale: AppLocale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={{ locale, dict }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within DictionaryProvider");
  }
  return context.dict;
}

export function useOptionalDictionary(): Dictionary | null {
  const context = useContext(DictionaryContext);
  return context?.dict ?? null;
}

export function useDictionaryLocale() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionaryLocale must be used within DictionaryProvider");
  }
  return context.locale;
}
