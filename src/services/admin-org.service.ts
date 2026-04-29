import { privateClient } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api-response.type'
import type { AdminOrgDetail } from '@/types/admin-org.types'

export const adminOrgService = {
  async getOrgById(
    orgId: string,
    params: { billingPage?: number; billingPageSize?: number } = {},
  ): Promise<AdminOrgDetail> {
    const { billingPage = 1, billingPageSize = 20 } = params
    const { data } = await privateClient.get<ApiResponse<AdminOrgDetail>>(
      `/api/core/admin/orgs/${encodeURIComponent(orgId)}`,
      { params: { billingPage, billingPageSize } },
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch organization')
    return data.data
  },
}

