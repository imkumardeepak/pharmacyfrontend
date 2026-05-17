// path: frontend/src/features/items/api/items.api.ts
import { z } from 'zod';
import { api } from '@/lib/api';

// ── Zod schema mirrors .NET ItemResponse (decimals come as strings over JSON) ──
export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  pack: z.string(),
  hsnCode: z.string(),
  baseMrp: z.string(),
  taxRate: z.string(),
  scheduleType: z.string(),
  isNarcotic: z.boolean(),
  barcode: z.string().nullable(),
  isActive: z.boolean(),
  saltId: z.string().nullable(),
  saltName: z.string().nullable(),
  companyId: z.string(),
  companyName: z.string(),
  createdAt: z.string(),
});
export type Item = z.infer<typeof itemSchema>;

export interface ItemListResp {
  rows: Item[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ItemListParams {
  q?: string;
  companyId?: string;
  scheduleType?: string;
  page?: number;
  pageSize?: number;
}

export interface ItemInput {
  name: string;
  pack: string;
  hsnCode: string;
  baseMrp: string | number;
  taxRate: string | number;
  scheduleType: string;
  isNarcotic: boolean;
  barcode?: string | null;
  saltId?: string | null;
  companyId: string;
}

const qs = (p: ItemListParams) => {
  const u = new URLSearchParams();
  if (p.q) u.set('q', p.q);
  if (p.companyId) u.set('companyId', p.companyId);
  if (p.scheduleType) u.set('scheduleType', p.scheduleType);
  u.set('page', String(p.page ?? 1));
  u.set('pageSize', String(p.pageSize ?? 50));
  return u.toString();
};

export const itemsApi = {
  list: (p: ItemListParams = {}) => api.get<ItemListResp>(`/items?${qs(p)}`),
  get: (id: string) => api.get<Item>(`/items/${id}`),
  create: (body: ItemInput) => api.post<Item>('/items', body),
  update: (id: string, body: Partial<ItemInput>) => api.put<Item>(`/items/${id}`, body),
  deactivate: (id: string) => api.delete<void>(`/items/${id}`),
};
