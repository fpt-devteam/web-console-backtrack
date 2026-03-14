import { useQuery, useMutation } from '@tanstack/react-query';
import {
  invitationService,
  type CheckInvitationPayload,
  type JoinByInvitationPayload,
} from '@/services/invitation.service';

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

export function useCheckInvitation() {
  return useMutation({
    mutationFn: (payload: CheckInvitationPayload) => invitationService.check(payload),
  });
}

export function useJoinByInvitation() {
  return useMutation({
    mutationFn: (payload: JoinByInvitationPayload) => invitationService.join(payload),
  });
}
