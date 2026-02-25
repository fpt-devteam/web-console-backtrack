import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orgService } from '@/services/org.service';
import type { CreateOrganizationPayload, UpdateOrganizationPayload } from '@/types/organization.types';

export const ORG_KEYS = { myOrgs: ['orgs', 'me'] as const, byId: (id: string) => ['orgs', id] as const };

export function useMyOrganizations() {
  return useQuery({
    queryKey: ORG_KEYS.myOrgs,
    queryFn: () => orgService.getMyOrgs(),
  });
}

export function useOrganization(orgId: string | null) {
  return useQuery({
    queryKey: ORG_KEYS.byId(orgId ?? ''),
    queryFn: () => orgService.getById(orgId!),
    enabled: !!orgId,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) => orgService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORG_KEYS.myOrgs }),
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, payload }: { orgId: string; payload: UpdateOrganizationPayload }) =>
      orgService.update(orgId, payload),
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: ORG_KEYS.myOrgs });
      queryClient.invalidateQueries({ queryKey: ORG_KEYS.byId(orgId) });
    },
  });
}
