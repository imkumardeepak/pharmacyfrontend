// path: frontend/src/features/invoices/api/invoices.api.ts
import { z } from 'zod';
import { api } from '@/lib/api';

// ── List response ──
export const invoiceListSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  partyName: z.string(),
  type: z.string(),
  status: z.string(),
  invoiceDate: z.string(),
  paymentMode: z.string(),
  totalAmount: z.string(),
  doctorName: z.string().nullable(),
  salesmanName: z.string().nullable(),
});
export type InvoiceListItem = z.infer<typeof invoiceListSchema>;

export interface InvoiceListResp { rows: InvoiceListItem[]; total: number; page: number; pageSize: number; }
export interface InvoiceListParams {
  type?: string; partyId?: string; from?: string; to?: string; page?: number; pageSize?: number;
}

const qs = (p: InvoiceListParams) => {
  const u = new URLSearchParams();
  if (p.type) u.set('type', p.type);
  if (p.partyId) u.set('partyId', p.partyId);
  if (p.from) u.set('from', p.from);
  if (p.to) u.set('to', p.to);
  u.set('page', String(p.page ?? 1)); u.set('pageSize', String(p.pageSize ?? 50));
  return u.toString();
};

// ── Cash Sale ──
export interface CashSaleLineInput {
  itemId: string; batchId: string; qty: number; freeQty: number;
  unitPrice: string; discount: string; tax: string;
}
export interface CashSaleInput {
  paymentMode: string; doctorId?: string | null; salesmanId?: string | null;
  prescriptionRef?: string | null; patientName?: string | null; lines: CashSaleLineInput[];
}

export const invoicesApi = {
  list: (p: InvoiceListParams = {}) => api.get<InvoiceListResp>(`/invoices?${qs(p)}`),
  get: (id: string) => api.get<InvoiceListItem>(`/invoices/${id}`),
  createCashSale: (body: CashSaleInput) => api.post<InvoiceListItem>('/invoices/cash-sale', body),
  // credit-sale and purchase follow same pattern
};
