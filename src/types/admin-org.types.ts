import type { Organization } from '@/types/organization.types'
import type { AdminPaymentHistoryItem, AdminSubscriptionResult } from '@/types/admin-user.types'

export interface AdminOrgUsageOverview {
  memberCount: number
  totalPostCount: number
  activePostCount: number
}

/** BE: AdminOrgDetailResult — GET /api/core/admin/orgs/{orgId} */
export interface AdminOrgDetail {
  basicInfo: Organization
  subscription: AdminSubscriptionResult | null
  usageOverview: AdminOrgUsageOverview
  billingHistory: Array<AdminPaymentHistoryItem>
}

