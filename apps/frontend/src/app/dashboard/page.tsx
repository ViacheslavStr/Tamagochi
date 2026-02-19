'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { useTranslation } from '@/contexts/LocaleContext';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<{ firstName: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } finally {
      setLoggingOut(false);
    }
  }

  if (!mounted || !user) {
    return null;
  }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardCard}>
        <header className={styles.header}>
          <h1>{t('dashboard.welcome', { name: user.firstName })}</h1>
          <button onClick={handleLogout} className={styles.logoutBtn} disabled={loggingOut}>
            {loggingOut ? t('dashboard.loggingOut') : t('common.logout')}
          </button>
        </header>
        <p>{t('dashboard.comingSoon')}</p>
      </div>
    </div>
  );
}
