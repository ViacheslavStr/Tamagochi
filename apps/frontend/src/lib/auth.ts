// Auth utilities for token management

const ACCESS_TOKEN_KEY = 'tamagochi_access_token';
const REFRESH_TOKEN_KEY = 'tamagochi_refresh_token';
const USER_KEY = 'tamagochi_user';

export function saveAuthData(accessToken: string, refreshToken: string, user: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUser(): any | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function clearAuthData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Logout: invalidate refresh token on server (if any), then clear local auth data. */
export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  const apiUrl = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : undefined;
  if (refreshToken && apiUrl) {
    try {
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Ignore network errors; we still clear local state
    }
  }
  clearAuthData();
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
