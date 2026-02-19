'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/LocaleContext';
import styles from './register.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300';

type Role = 'mother' | 'father';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const ageNum = parseInt(age, 10);
    if (!role || isNaN(ageNum) || ageNum < 18 || !email || password.length < 8) {
      setError(t('register.errorValidation'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          age: ageNum,
          role,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = Array.isArray(data.message) ? data.message.join(', ') : data.message || t('register.errorValidation');
        setError(message);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError(t('register.errorServer'));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.registerPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>{t('register.successTitle')}</h2>
          <p>{t('register.successText')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerCard}>
        <header className={styles.registerHeader}>
          <h1>{t('register.title')}</h1>
          <p>{t('register.subtitle')}</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div className={styles.fieldGroup}>
            <label htmlFor="firstName">{t('register.firstName')}</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t('register.firstNamePlaceholder')}
              autoComplete="given-name"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="lastName">{t('register.lastName')}</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t('register.lastNamePlaceholder')}
              autoComplete="family-name"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="email">{t('register.email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('register.emailPlaceholder')}
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password">{t('register.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('register.passwordPlaceholder')}
              autoComplete="new-password"
              disabled={loading}
              minLength={8}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="age">{t('register.age')}</label>
            <input
              id="age"
              type="number"
              min={18}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder={t('register.agePlaceholder')}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.label}>{t('register.iAm')}</span>
            <div className={styles.roleOptions}>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'mother' ? styles.active : ''}`}
                onClick={() => setRole('mother')}
                disabled={loading}
              >
                {t('register.mother')}
              </button>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'father' ? styles.active : ''}`}
                onClick={() => setRole('father')}
                disabled={loading}
              >
                {t('register.father')}
              </button>
            </div>
          </div>

          {error && <p className={styles.formError}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? t('register.submitting') : t('register.submit')}
          </button>

          <p className={styles.loginLink}>
            {t('register.hasAccount')} <a href="/login">{t('common.logIn')}</a>
          </p>
        </form>
      </div>
    </div>
  );
}
