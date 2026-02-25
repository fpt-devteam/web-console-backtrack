import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orgService } from '@/services/org.service';
import type { CreateOrganizationPayload } from '@/types/organization.types';

const ORG_KEYS = { myOrgs: ['orgs', 'me'] as const };

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) => orgService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORG_KEYS.myOrgs }),
  });
}
