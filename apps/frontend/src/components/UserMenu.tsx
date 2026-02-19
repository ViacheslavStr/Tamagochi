'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { useTranslation } from '@/contexts/LocaleContext';
import styles from './UserMenu.module.css';

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function UserMenu() {
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      setOpen(false);
      router.push('/login');
    } finally {
      setLoggingOut(false);
    }
  }

  if (!mounted || !user) return null;

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={user.email || 'User menu'}
      >
        <UserIcon />
      </button>
      {open && (
        <div className={styles.dropdown}>
          <Link
            href="/dashboard"
            className={styles.item}
            onClick={() => setOpen(false)}
          >
            {t('common.profile')}
          </Link>
          <button
            type="button"
            className={styles.item}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? '…' : t('common.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
