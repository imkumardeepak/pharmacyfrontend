// path: frontend/src/features/parties/hooks/useParties.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { partiesApi, type PartyInput, type PartyListParams } from '../api/parties.api';

const KEY = ['parties'] as const;

export function usePartiesQuery(params: PartyListParams) {
  return useQuery({ queryKey: [...KEY, params], queryFn: () => partiesApi.list(params), placeholderData: (prev) => prev });
}

export function usePartyOutstanding(id: string) {
  return useQuery({ queryKey: [...KEY, 'outstanding', id], queryFn: () => partiesApi.getOutstanding(id), enabled: !!id });
}

export function useCreateParty() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (input: PartyInput) => partiesApi.create(input), onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) });
}

export function useUpdateParty() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<PartyInput> }) => partiesApi.update(id, input), onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) });
}
