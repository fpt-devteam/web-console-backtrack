import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orgService } from '@/services/org.service';
import type { CreateOrganizationPayload, UpdateOrganizationPayload } from '@/types/organization.types';

export const ORG_KEYS = {
  myOrgs: ['orgs', 'me'] as const,
  byId: (id: string) => ['orgs', id] as const,
  members: (orgId: string, page?: number, pageSize?: number) =>
    ['orgs', orgId, 'members', page, pageSize] as const,
};

export function useMyOrganizations(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ORG_KEYS.myOrgs,
    queryFn: () => orgService.getMyOrgs(),
    enabled: options?.enabled !== false,
  });
}

export function useOrganization(orgId: string | null) {
  return useQuery({
    queryKey: ORG_KEYS.byId(orgId ?? ''),
    queryFn: () => orgService.getById(orgId!),
    enabled: !!orgId,
  });
}

export function useOrgMembers(orgId: string | null, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ORG_KEYS.members(orgId ?? '', page, pageSize),
    queryFn: () => orgService.getMembers(orgId!, page, pageSize),
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

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orgId,
      membershipId,
      role,
    }: {
      orgId: string;
      membershipId: string;
      role: string;
    }) => orgService.updateMemberRole(orgId, membershipId, role),
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: ['orgs', orgId] });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, membershipId }: { orgId: string; membershipId: string }) =>
      orgService.removeMember(orgId, membershipId),
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: ['orgs', orgId] });
    },
  });
}
