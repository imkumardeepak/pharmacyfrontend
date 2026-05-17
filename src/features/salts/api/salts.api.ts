// path: frontend/src/features/salts/api/salts.api.ts
import { z } from 'zod';
import { api } from '@/lib/api';

export const saltSchema = z.object({
  id: z.string(),
  name: z.string(),
  defaultStrength: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
});
export type Salt = z.infer<typeof saltSchema>;

export interface SaltListResp {
  rows: Salt[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SaltListParams {
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface SaltInput {
  name: string;
  defaultStrength?: string | null;
}

const qs = (p: SaltListParams) => {
  const u = new URLSearchParams();
  if (p.q) u.set('q', p.q);
  u.set('page', String(p.page ?? 1));
  u.set('pageSize', String(p.pageSize ?? 50));
  return u.toString();
};

export const saltsApi = {
  list: (p: SaltListParams = {}) => api.get<SaltListResp>(`/salts?${qs(p)}`),
  get: (id: string) => api.get<Salt>(`/salts/${id}`),
  create: (body: SaltInput) => api.post<Salt>('/salts', body),
  update: (id: string, body: Partial<SaltInput>) => api.put<Salt>(`/salts/${id}`, body),
};
