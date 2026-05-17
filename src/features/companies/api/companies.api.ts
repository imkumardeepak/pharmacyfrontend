// path: frontend/src/features/companies/api/companies.api.ts
import { z } from 'zod';
import { api } from '@/lib/api';

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  gstNumber: z.string().nullable(),
  address: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
});
export type Company = z.infer<typeof companySchema>;

export interface CompanyListResp { rows: Company[]; total: number; page: number; pageSize: number; }
export interface CompanyListParams { q?: string; page?: number; pageSize?: number; }
export interface CompanyInput { name: string; gstNumber?: string | null; address?: string | null; }

const qs = (p: CompanyListParams) => {
  const u = new URLSearchParams();
  if (p.q) u.set('q', p.q);
  u.set('page', String(p.page ?? 1));
  u.set('pageSize', String(p.pageSize ?? 50));
  return u.toString();
};

export const companiesApi = {
  list: (p: CompanyListParams = {}) => api.get<CompanyListResp>(`/companies?${qs(p)}`),
  get: (id: string) => api.get<Company>(`/companies/${id}`),
  create: (body: CompanyInput) => api.post<Company>('/companies', body),
  update: (id: string, body: Partial<CompanyInput>) => api.put<Company>(`/companies/${id}`, body),
};
