// path: frontend/src/features/invoices/hooks/useInvoices.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoicesApi, type CashSaleInput, type InvoiceListParams } from '../api/invoices.api';
const KEY = ['invoices'] as const;
export function useInvoicesQuery(params: InvoiceListParams) { return useQuery({ queryKey: [...KEY, params], queryFn: () => invoicesApi.list(params), placeholderData: (prev) => prev }); }
export function useCreateCashSale() { const qc = useQueryClient(); return useMutation({ mutationFn: (i: CashSaleInput) => invoicesApi.createCashSale(i), onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) }); }
