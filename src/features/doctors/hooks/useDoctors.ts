// path: frontend/src/features/doctors/hooks/useDoctors.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { doctorsApi, type DoctorInput, type DoctorListParams } from '../api/doctors.api';

const KEY = ['doctors'] as const;
export function useDoctorsQuery(params: DoctorListParams) { return useQuery({ queryKey: [...KEY, params], queryFn: () => doctorsApi.list(params), placeholderData: (prev) => prev }); }
export function useCreateDoctor() { const qc = useQueryClient(); return useMutation({ mutationFn: (i: DoctorInput) => doctorsApi.create(i), onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) }); }
export function useUpdateDoctor() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<DoctorInput> }) => doctorsApi.update(id, input), onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) }); }
