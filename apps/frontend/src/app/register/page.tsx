'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300';

type Role = 'mother' | 'father';

export default function RegisterPage() {
  const router = useRouter();
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
      setError('Please fill all fields. Age must be 18+, password at least 8 characters.');
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
        const message = Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Registration failed';
        setError(message);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.registerPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>Registration successful!</h2>
          <p>Thank you! Your account has been created. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerCard}>
        <header className={styles.registerHeader}>
          <h1>Parent Registration</h1>
          <p>Tell us about yourself — this will help create your electronic child</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div className={styles.fieldGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g., Anna"
              autoComplete="given-name"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g., Smith"
              autoComplete="family-name"
              disabled={loading}
              required
            />
          </div>

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
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={loading}
              minLength={8}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              min={18}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.label}>I am —</span>
            <div className={styles.roleOptions}>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'mother' ? styles.active : ''}`}
                onClick={() => setRole('mother')}
                disabled={loading}
              >
                Mother
              </button>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'father' ? styles.active : ''}`}
                onClick={() => setRole('father')}
                disabled={loading}
              >
                Father
              </button>
            </div>
          </div>

          {error && <p className={styles.formError}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Registering...' : 'Continue'}
          </button>

          <p className={styles.loginLink}>
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
