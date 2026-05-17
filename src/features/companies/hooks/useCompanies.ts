// path: frontend/src/features/companies/hooks/useCompanies.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companiesApi, type CompanyInput, type CompanyListParams } from '../api/companies.api';

const KEY = ['companies'] as const;

export function useCompaniesQuery(params: CompanyListParams) {
  return useQuery({ queryKey: [...KEY, params], queryFn: () => companiesApi.list(params), placeholderData: (prev) => prev });
}

export function useCreateCompany() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (input: CompanyInput) => companiesApi.create(input), onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) });
}

export function useUpdateCompany() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<CompanyInput> }) => companiesApi.update(id, input), onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) });
}
