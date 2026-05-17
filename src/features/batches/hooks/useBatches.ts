// path: frontend/src/features/batches/hooks/useBatches.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { batchesApi, type BatchInput, type BatchListParams } from '../api/batches.api';
const KEY = ['batches'] as const;
export function useBatchesQuery(params: BatchListParams) { return useQuery({ queryKey: [...KEY, params], queryFn: () => batchesApi.list(params), placeholderData: (prev) => prev }); }
export function useCreateBatch() { const qc = useQueryClient(); return useMutation({ mutationFn: (i: BatchInput) => batchesApi.create(i), onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) }); }
