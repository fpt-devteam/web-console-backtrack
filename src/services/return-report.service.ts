import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';

export type OwnerInfoPayload = {
  ownerName?: string | null;
  email?: string | null;
  phone?: string | null;
  nationalId?: string | null;
  orgMemberId?: string | null;
};

export type OrgReturnReportResult = {
  id: string;
  expiresAt: string;
  createdAt: string;
};

export const returnReportService = {
  async createOrgReturnReport(orgId: string, payload: { postId: string; ownerInfo?: OwnerInfoPayload | null }) {
    const { data } = await privateClient.post<ApiResponse<OrgReturnReportResult>>(
      `/api/core/return-reports/org/${orgId}`,
      payload,
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create return report');
    return data.data;
  },
};

