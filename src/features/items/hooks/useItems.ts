// path: frontend/src/features/items/hooks/useItems.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { itemsApi, type ItemInput, type ItemListParams } from '../api/items.api';

const KEY = ['items'] as const;

export function useItemsQuery(params: ItemListParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => itemsApi.list(params),
    placeholderData: (prev) => prev, // keep last page visible while typing
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ItemInput) => itemsApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ItemInput> }) => itemsApi.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeactivateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemsApi.deactivate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
