// path: frontend/src/features/salts/hooks/useSalts.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saltsApi, type SaltInput, type SaltListParams } from '../api/salts.api';

const KEY = ['salts'] as const;

export function useSaltsQuery(params: SaltListParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => saltsApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useCreateSalt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SaltInput) => saltsApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateSalt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<SaltInput> }) => saltsApi.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
