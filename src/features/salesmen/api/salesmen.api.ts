// path: frontend/src/features/salesmen/api/salesmen.api.ts
import { z } from 'zod';
import { api } from '@/lib/api';

export const salesmanSchema = z.object({
  id: z.string(), name: z.string(), code: z.string(), commissionPercent: z.string(), isActive: z.boolean(), createdAt: z.string(),
});
export type Salesman = z.infer<typeof salesmanSchema>;

export interface SalesmanListResp { rows: Salesman[]; total: number; page: number; pageSize: number; }
export interface SalesmanListParams { q?: string; page?: number; pageSize?: number; }
export interface SalesmanInput { name: string; code: string; commissionPercent: string | number; }

const qs = (p: SalesmanListParams) => {
  const u = new URLSearchParams();
  if (p.q) u.set('q', p.q);
  u.set('page', String(p.page ?? 1)); u.set('pageSize', String(p.pageSize ?? 50));
  return u.toString();
};

export const salesmenApi = {
  list: (p: SalesmanListParams = {}) => api.get<SalesmanListResp>(`/salesmen?${qs(p)}`),
  get: (id: string) => api.get<Salesman>(`/salesmen/${id}`),
  create: (body: SalesmanInput) => api.post<Salesman>('/salesmen', body),
  update: (id: string, body: Partial<SalesmanInput>) => api.put<Salesman>(`/salesmen/${id}`, body),
};
