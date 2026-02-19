'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getInitialLocale, getMessage, interpolate, setLocaleCookie, type Locale } from '@/lib/i18n';
import en from '@/messages/en.json';
import uk from '@/messages/uk.json';

const messagesMap: Record<Locale, Record<string, unknown>> = { en, uk };

type TFunction = (key: string, vars?: Record<string, string>) => string;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TFunction;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getInitialLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setLocaleCookie(newLocale);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale === 'uk' ? 'uk' : 'en';
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale === 'uk' ? 'uk' : 'en';
  }, [mounted, locale]);

  const t: TFunction = useCallback(
    (key: string, vars?: Record<string, string>) => {
      const messages = messagesMap[locale];
      const text = getMessage(messages, key);
      if (text == null) return key;
      return vars ? interpolate(text, vars) : text;
    },
    [locale],
  );

  const value: LocaleContextValue = { locale, setLocale, t };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useTranslation must be used within LocaleProvider');
  return ctx;
}
