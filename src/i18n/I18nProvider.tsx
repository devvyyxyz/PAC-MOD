import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { TRANSLATIONS, getLocale, setLocale as setLocaleGlobal } from './index';

type I18nContextValue = {
  locale: string;
  setLocale: (l: string) => void;
  t: (key: string) => string;
  available: string[];
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children, defaultLocale }: { children: React.ReactNode; defaultLocale?: string }){
  const initial = defaultLocale || getLocale();
  const [locale, setLocaleState] = useState<string>(initial);

  const setLocale = useCallback((l: string) => {
    setLocaleState(l);
    try { setLocaleGlobal(l); } catch {}
  }, []);

  const t = useCallback((key: string) => TRANSLATIONS[locale]?.[key] ?? key, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t, available: Object.keys(TRANSLATIONS) }), [locale, setLocale, t]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(){
  const ctx = useContext(I18nContext);
  if(!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
