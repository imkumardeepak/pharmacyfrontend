// path: frontend/src/features/salesmen/hooks/useSalesmen.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { salesmenApi, type SalesmanInput, type SalesmanListParams } from '../api/salesmen.api';
const KEY = ['salesmen'] as const;
export function useSalesmenQuery(params: SalesmanListParams) { return useQuery({ queryKey: [...KEY, params], queryFn: () => salesmenApi.list(params), placeholderData: (prev) => prev }); }
export function useCreateSalesman() { const qc = useQueryClient(); return useMutation({ mutationFn: (i: SalesmanInput) => salesmenApi.create(i), onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) }); }
export function useUpdateSalesman() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<SalesmanInput> }) => salesmenApi.update(id, input), onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) }); }
