import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';

export interface CreateInvitationPayload {
  orgId: string;
  email: string;
  role: string; // 'OrgAdmin' | 'OrgStaff'
}

export interface CreateInvitationResult {
  id: string;
  email: string;
  role: string;
  status: string;
  expiredTime: string;
  createdAt: string;
}

export const invitationService = {
  async create(payload: CreateInvitationPayload): Promise<CreateInvitationResult> {
    const { data } = await privateClient.post<ApiResponse<CreateInvitationResult>>('/api/core/invitations', {
      orgId: payload.orgId,
      email: payload.email,
      role: payload.role,
    });
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create invitation');
    return data.data;
  },
};
