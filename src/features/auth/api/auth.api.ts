// path: frontend/src/features/auth/api/auth.api.ts
import { z } from 'zod';
import { api } from '@/lib/api';

// ── Zod schemas (mirror .NET DTOs) ──
export const loginRequestSchema = z.object({
  username: z.string().min(1, 'Username required'),
  password: z.string().min(1, 'Password required'),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const registerRequestSchema = z.object({
  username: z.string().min(3).max(60),
  password: z.string().min(4).max(100),
  displayName: z.string().max(120),
  role: z.string().max(30).optional(),
});
export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export interface AuthResponse {
  token: string;
  username: string;
  displayName: string;
  role: string;
  expiresAt: string;
}

export interface MeResponse {
  userId: string;
  username: string;
  displayName: string;
  role: string;
}

export const authApi = {
  login: (body: LoginRequest) => api.post<AuthResponse>('/auth/login', body),
  register: (body: RegisterRequest) => api.post<AuthResponse>('/auth/register', body),
  me: () => api.get<MeResponse>('/auth/me'),
};
