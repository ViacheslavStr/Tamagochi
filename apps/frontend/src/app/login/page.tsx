'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveAuthData } from '@/lib/auth';
import { useTranslation } from '@/contexts/LocaleContext';
import styles from './login.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError(t('login.errorRequired'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.message || t('login.errorInvalid');
        setError(message);
        return;
      }
      saveAuthData(data.accessToken, data.refreshToken, data.user);
      // Redirect based on user status
      if (data.user?.status === 'onboarded') {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    } catch {
      setError(t('login.errorServer'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <header className={styles.loginHeader}>
          <h1>{t('login.title')}</h1>
          <p>{t('login.subtitle')}</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.fieldGroup}>
            <label htmlFor="email">{t('login.email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')}
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password">{t('login.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.passwordPlaceholder')}
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          {error && <p className={styles.formError}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? t('login.submitting') : t('login.submit')}
          </button>

          <p className={styles.registerLink}>
            {t('login.noAccount')} <a href="/register">{t('common.register')}</a>
          </p>
        </form>
      </div>
    </div>
  );
}
