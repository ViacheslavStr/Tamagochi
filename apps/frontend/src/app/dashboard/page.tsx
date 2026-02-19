'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getAccessToken, logout } from '@/lib/auth';
import { useTranslation } from '@/contexts/LocaleContext';
import styles from './dashboard.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300';

type ChildMedia = { id: string; filePath: string; mediaType: string };
type ChildWithMedia = { id: string; name: string | null; familyId: string; media: ChildMedia[] };

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [child, setChild] = useState<ChildWithMedia | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  useEffect(() => {
    if (!mounted || !user) return;
    const token = getAccessToken();
    if (!token) return;
    fetch(`${API_URL}/children`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : []))
      .then((list: { id: string }[]) => {
        if (list.length > 0) {
          return fetch(`${API_URL}/children/${list[0].id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => (r.ok ? r.json() : null));
        }
        return null;
      })
      .then(setChild)
      .catch(() => setChild(null));
  }, [mounted, user]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } finally {
      setLoggingOut(false);
    }
  }

  async function handleGenerateChild() {
    setError(null);
    setGenerating(true);
    const token = getAccessToken();
    if (!token) {
      setError(t('dashboard.errorAuth'));
      setGenerating(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/generation/child`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || t('dashboard.errorGenerate'));
        return;
      }
      setChild({
        id: data.child.id,
        name: data.child.name,
        familyId: data.child.familyId,
        media: data.media ? [data.media] : [],
      });
    } catch {
      setError(t('dashboard.errorGenerate'));
    } finally {
      setGenerating(false);
    }
  }

  if (!mounted || !user) {
    return null;
  }

  const childPhoto = child?.media?.find((m) => m.mediaType === 'photo');
  const imageUrl =
    childPhoto?.filePath != null
      ? childPhoto.filePath.startsWith('http')
        ? childPhoto.filePath
        : `${API_URL}${childPhoto.filePath}`
      : null;

  const content = (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardCard}>
        <header className={styles.header}>
          <h1>{t('dashboard.welcome', { name: user.email || 'User' })}</h1>
          <button onClick={handleLogout} className={styles.logoutBtn} disabled={loggingOut}>
            {loggingOut ? t('dashboard.loggingOut') : t('common.logout')}
          </button>
        </header>

        <section className={styles.childSection}>
          <h2 className={styles.childSectionTitle}>{t('dashboard.yourChild')}</h2>
          {error && <p className={styles.error}>{error}</p>}
          {imageUrl ? (
            <div className={styles.childPreview}>
              <img src={imageUrl} alt="" className={styles.childImage} />
              <button
                type="button"
                onClick={handleGenerateChild}
                className={styles.generateBtn}
                disabled={generating}
              >
                {generating ? t('dashboard.generating') : t('dashboard.generateAgain')}
              </button>
            </div>
          ) : (
            <>
              <p className={styles.childHint}>{t('dashboard.comingSoon')}</p>
              <button
                type="button"
                onClick={handleGenerateChild}
                className={styles.generateBtn}
                disabled={generating}
              >
                {generating ? t('dashboard.generating') : t('dashboard.generateChild')}
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );

  return content;
}
