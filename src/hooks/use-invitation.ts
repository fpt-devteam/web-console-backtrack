import { useQuery } from '@tanstack/react-query';
import { invitationService } from '@/services/invitation.service';

export const INVITATION_KEYS = {
  pending: (orgId: string | null) => ['invitations', 'pending', orgId] as const,
};

export function usePendingInvitations(orgId: string | null) {
  return useQuery({
    queryKey: INVITATION_KEYS.pending(orgId),
    queryFn: () => invitationService.getPending(orgId!),
    enabled: !!orgId,
  });
}
