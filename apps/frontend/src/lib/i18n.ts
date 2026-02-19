export type Locale = 'en' | 'uk';

const COOKIE_NAME = 'locale';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export function getLocaleFromCookie(): Locale | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  const value = match?.[1];
  if (value === 'en' || value === 'uk') return value;
  return null;
}

export function setLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=${locale};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
}

export function getInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    const fromCookie = getLocaleFromCookie();
    if (fromCookie) return fromCookie;
    const lang = navigator.language?.toLowerCase();
    if (lang?.startsWith('uk')) return 'uk';
  }
  return 'en';
}

// Simple key path lookup: "home.title" -> messages.home.title
export function getMessage(messages: Record<string, unknown>, key: string): string | undefined {
  const parts = key.split('.');
  let current: unknown = messages;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export function interpolate(text: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), v),
    text,
  );
}
