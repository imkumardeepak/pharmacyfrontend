// path: frontend/src/features/payments/hooks/usePayments.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, type PaymentInput, type PaymentListParams } from '../api/payments.api';
const KEY = ['payments'] as const;
export function usePaymentsQuery(params: PaymentListParams) { return useQuery({ queryKey: [...KEY, params], queryFn: () => paymentsApi.list(params), placeholderData: (prev) => prev }); }
export function useCreatePayment() { const qc = useQueryClient(); return useMutation({ mutationFn: (i: PaymentInput) => paymentsApi.create(i), onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) }); }
