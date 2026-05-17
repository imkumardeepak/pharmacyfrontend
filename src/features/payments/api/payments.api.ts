// path: frontend/src/features/payments/api/payments.api.ts
import { z } from 'zod';
import { api } from '@/lib/api';

export const paymentSchema = z.object({
  id: z.string(), voucherNo: z.string(), partyName: z.string(),
  direction: z.string(), mode: z.string(), amount: z.number(),
  paymentDate: z.string(), narration: z.string().nullable(),
});
export type Payment = z.infer<typeof paymentSchema>;

export interface PaymentListResp { rows: Payment[]; total: number; page: number; pageSize: number; }
export interface PaymentListParams {
  partyId?: string; direction?: string; from?: string; to?: string; page?: number; pageSize?: number;
}
export interface PaymentInput {
  partyId: string; direction: string; mode: string; refNumber?: string | null;
  amount: string | number; paymentDate?: string | null; narration?: string | null;
}

const qs = (p: PaymentListParams) => {
  const u = new URLSearchParams();
  if (p.partyId) u.set('partyId', p.partyId);
  if (p.direction) u.set('direction', p.direction);
  if (p.from) u.set('from', p.from);
  if (p.to) u.set('to', p.to);
  u.set('page', String(p.page ?? 1)); u.set('pageSize', String(p.pageSize ?? 50));
  return u.toString();
};

export const paymentsApi = {
  list: (p: PaymentListParams = {}) => api.get<PaymentListResp>(`/payments?${qs(p)}`),
  get: (id: string) => api.get<Payment>(`/payments/${id}`),
  create: (body: PaymentInput) => api.post<Payment>('/payments', body),
};
