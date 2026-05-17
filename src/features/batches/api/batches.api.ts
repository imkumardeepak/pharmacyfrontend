// path: frontend/src/features/batches/api/batches.api.ts
import { z } from 'zod';
import { api } from '@/lib/api';

export const batchSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  batchNumber: z.string(),
  expiryDate: z.string(),
  costPrice: z.string(),
  mrp: z.string(),
  sellingPrice: z.string(),
  stockQty: z.number(),
  item: z.object({ id: z.string(), name: z.string(), company: z.object({ id: z.string(), name: z.string() }).nullish() }).nullish(),
});
export type Batch = z.infer<typeof batchSchema>;

export interface BatchListResp { rows: Batch[]; total: number; page: number; pageSize: number; }
export interface BatchListParams {
  itemId?: string; expiringWithinDays?: number; page?: number; pageSize?: number;
}
export interface BatchInput {
  itemId: string; batchNumber: string; expiryDate: string; costPrice: string | number;
  mrp: string | number; sellingPrice: string | number; stockQty: number;
}

const qs = (p: BatchListParams) => {
  const u = new URLSearchParams();
  if (p.itemId) u.set('itemId', p.itemId);
  if (p.expiringWithinDays !== undefined) u.set('expiringWithinDays', String(p.expiringWithinDays));
  u.set('page', String(p.page ?? 1)); u.set('pageSize', String(p.pageSize ?? 50));
  return u.toString();
};

export const batchesApi = {
  list: (p: BatchListParams = {}) => api.get<BatchListResp>(`/batches?${qs(p)}`),
  get: (id: string) => api.get<Batch>(`/batches/${id}`),
  getFifo: (itemId: string) => api.get<Batch>(`/batches/fifo/${itemId}`),
  create: (body: BatchInput) => api.post<Batch>('/batches', body),
};
