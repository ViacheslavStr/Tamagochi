'use client';

import { useTranslation } from '@/contexts/LocaleContext';
import type { Locale } from '@/lib/i18n';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      <button
        type="button"
        className={locale === 'en' ? `${styles.btn} ${styles.active}` : styles.btn}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        className={locale === 'uk' ? `${styles.btn} ${styles.active}` : styles.btn}
        onClick={() => setLocale('uk')}
        aria-pressed={locale === 'uk'}
      >
        UA
      </button>
    </div>
  );
}
