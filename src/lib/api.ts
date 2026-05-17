// path: frontend/src/lib/api.ts
// Minimal typed fetch wrapper with JWT injection. Throws an Error on non-2xx with the API error payload.
import { useAuthStore } from '@/stores/authStore';

export type ApiError = { code: string; message: string; issues?: unknown };

// Use environment variable for API URL, fallback to '/api' for Vite proxy
const BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<TResp>(path: string, init?: RequestInit): Promise<TResp> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  // 401 → auto-logout
  if (res.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const err = (data as { error?: ApiError } | null)?.error;
    throw Object.assign(new Error(err?.message ?? `HTTP ${res.status}`), { code: err?.code, issues: err?.issues });
  }
  return data as TResp;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
