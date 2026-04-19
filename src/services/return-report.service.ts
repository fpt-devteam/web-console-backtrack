import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { PagedResponse } from '@/types/pagination.type';
import type { InventoryItem } from '@/services/inventory.service';

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
  staff?: { id: string; displayName?: string | null; avatarUrl?: string | null } | null;
  ownerInfo?: OwnerInfoPayload | null;
  /** Full post payload from BE (`PostResult`); used for history cards. */
  post?: InventoryItem | null;
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

  async getOrgReturnReports(orgId: string, page = 1, pageSize = 50): Promise<PagedResponse<OrgReturnReportResult>> {
    const { data } = await privateClient.get<ApiResponse<PagedResponse<OrgReturnReportResult>>>(
      `/api/core/return-reports/org/${orgId}`,
      { params: { page, pageSize } },
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch return reports');
    return data.data;
  },
};

