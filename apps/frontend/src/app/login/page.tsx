'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveAuthData } from '@/lib/auth';
import styles from './login.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter email and password');
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
        const message = data.message || 'Invalid email or password';
        setError(message);
        return;
      }
      // Save tokens and user data
      saveAuthData(data.accessToken, data.refreshToken, data.user);
      // Redirect to onboarding
      router.push('/onboarding');
    } catch {
      setError('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <header className={styles.loginHeader}>
          <h1>Login</h1>
          <p>Welcome back! Sign in to your account</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.fieldGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anna@example.com"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          {error && <p className={styles.formError}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <p className={styles.registerLink}>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}
