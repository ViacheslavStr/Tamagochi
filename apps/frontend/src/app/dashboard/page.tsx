'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, clearAuthData } from '@/lib/auth';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  function handleLogout() {
    clearAuthData();
    router.push('/login');
  }

  if (!mounted || !user) {
    return null;
  }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardCard}>
        <header className={styles.header}>
          <h1>Welcome, {user.firstName}!</h1>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </header>
        <p>Your dashboard is coming soon. Here you'll see your electronic child once it's created.</p>
      </div>
    </div>
  );
}
