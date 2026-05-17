// path: frontend/src/features/parties/api/parties.api.ts
import { z } from 'zod';
import { api } from '@/lib/api';

export const partyTypeEnum = ['Customer', 'Supplier', 'Both', 'WalkIn'] as const;

export const partySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(partyTypeEnum),
  dlNumber: z.string().nullable(),
  gstNumber: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  creditLimit: z.string(),
  baseDiscount: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
});
export type Party = z.infer<typeof partySchema>;

export interface PartyListResp { rows: Party[]; total: number; page: number; pageSize: number; }
export interface PartyListParams {
  q?: string; type?: string; page?: number; pageSize?: number;
}
export interface PartyInput {
  name: string; type: string; dlNumber?: string | null; gstNumber?: string | null;
  phone?: string | null; address?: string | null; creditLimit: string | number; baseDiscount: string | number;
}
export interface OutstandingResp { partyId: string; balance: string; }

const qs = (p: PartyListParams) => {
  const u = new URLSearchParams();
  if (p.q) u.set('q', p.q);
  if (p.type) u.set('type', p.type);
  u.set('page', String(p.page ?? 1)); u.set('pageSize', String(p.pageSize ?? 50));
  return u.toString();
};

export const partiesApi = {
  list: (p: PartyListParams = {}) => api.get<PartyListResp>(`/parties?${qs(p)}`),
  get: (id: string) => api.get<Party>(`/parties/${id}`),
  getOutstanding: (id: string) => api.get<OutstandingResp>(`/parties/${id}/outstanding`),
  create: (body: PartyInput) => api.post<Party>('/parties', body),
  update: (id: string, body: Partial<PartyInput>) => api.put<Party>(`/parties/${id}`, body),
};
