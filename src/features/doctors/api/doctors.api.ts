// path: frontend/src/features/doctors/api/doctors.api.ts
import { z } from 'zod';
import { api } from '@/lib/api';

export const doctorSchema = z.object({
  id: z.string(), name: z.string(), regNumber: z.string().nullable(), qualification: z.string().nullable(),
  phone: z.string().nullable(), commissionPercent: z.string(), isActive: z.boolean(), createdAt: z.string(),
});
export type Doctor = z.infer<typeof doctorSchema>;

export interface DoctorListResp { rows: Doctor[]; total: number; page: number; pageSize: number; }
export interface DoctorListParams { q?: string; page?: number; pageSize?: number; }
export interface DoctorInput { name: string; regNumber?: string | null; qualification?: string | null; phone?: string | null; commissionPercent: string | number; }

const qs = (p: DoctorListParams) => {
  const u = new URLSearchParams();
  if (p.q) u.set('q', p.q);
  u.set('page', String(p.page ?? 1)); u.set('pageSize', String(p.pageSize ?? 50));
  return u.toString();
};

export const doctorsApi = {
  list: (p: DoctorListParams = {}) => api.get<DoctorListResp>(`/doctors?${qs(p)}`),
  get: (id: string) => api.get<Doctor>(`/doctors/${id}`),
  create: (body: DoctorInput) => api.post<Doctor>('/doctors', body),
  update: (id: string, body: Partial<DoctorInput>) => api.put<Doctor>(`/doctors/${id}`, body),
};
