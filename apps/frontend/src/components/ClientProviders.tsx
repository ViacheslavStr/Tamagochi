'use client';

import { LocaleProvider } from '@/contexts/LocaleContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserMenu } from './UserMenu';
import styles from './ClientProviders.module.css';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.headerSpacer} />
          <UserMenu />
          <LanguageSwitcher />
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </LocaleProvider>
  );
}
