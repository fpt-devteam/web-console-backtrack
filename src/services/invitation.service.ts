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

export interface CheckInvitationPayload {
  token: string;
  email: string;
}

export interface CheckInvitationResult {
  isTokenValid: boolean;
  organizationName?: string;
  role?: string;
}

export interface JoinByInvitationPayload {
  token: string;
}

export interface JoinByInvitationResult {
  organizationId: string;
  membershipId: string;
  role: string;
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

  /** POST /api/core/invitations/check */
  async check(payload: CheckInvitationPayload): Promise<CheckInvitationResult> {
    const { data } = await privateClient.post<ApiResponse<CheckInvitationResult>>(
      '/api/core/invitations/check',
      payload,
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to check invitation');
    return data.data;
  },

  /** POST /api/core/invitations/join */
  async join(payload: JoinByInvitationPayload): Promise<JoinByInvitationResult> {
    const { data } = await privateClient.post<ApiResponse<JoinByInvitationResult>>(
      '/api/core/invitations/join',
      payload,
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to join organization');
    return data.data;
  },
};
