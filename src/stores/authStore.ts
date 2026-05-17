// path: frontend/src/stores/authStore.ts
// Zustand store for JWT token + user info. Persisted to localStorage.
import { create } from 'zustand';

export interface AuthUser {
  userId: string;
  username: string;
  displayName: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  expiresAt: string | null;
  isAuthenticated: boolean;

  setAuth: (token: string, user: AuthUser, expiresAt: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

function loadPersisted(): { token: string | null; user: AuthUser | null; expiresAt: string | null } {
  try {
    const token = localStorage.getItem('auth_token');
    const user = JSON.parse(localStorage.getItem('auth_user') ?? 'null') as AuthUser | null;
    const expiresAt = localStorage.getItem('auth_expires');
    if (token && expiresAt && new Date(expiresAt) > new Date()) {
      return { token, user, expiresAt };
    }
    // Expired — clear
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_expires');
  } catch { /* ignore */ }
  return { token: null, user: null, expiresAt: null };
}

const persisted = loadPersisted();

export const useAuthStore = create<AuthState>((set, get) => ({
  token: persisted.token,
  user: persisted.user,
  expiresAt: persisted.expiresAt,
  isAuthenticated: !!persisted.token,

  setAuth: (token, user, expiresAt) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_expires', expiresAt);
    set({ token, user, expiresAt, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_expires');
    set({ token: null, user: null, expiresAt: null, isAuthenticated: false });
  },

  getToken: () => get().token,
}));
