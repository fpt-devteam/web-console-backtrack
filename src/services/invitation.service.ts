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

/** Single invitation from GET /api/core/invitations/pending */
export interface PendingInvitationItem {
  id: string;
  email: string;
  role: string;
  status: string;
  expiredTime: string;
  createdAt: string;
}

export interface GetPendingInvitationsResult {
  invitations: PendingInvitationItem[];
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

  /** GET /api/core/invitations/pending?organizationId=... */
  async getPending(organizationId: string): Promise<GetPendingInvitationsResult> {
    const { data } = await privateClient.get<ApiResponse<GetPendingInvitationsResult>>(
      '/api/core/invitations/pending',
      { params: { organizationId } }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch pending invitations');
    return data.data;
  },
};
