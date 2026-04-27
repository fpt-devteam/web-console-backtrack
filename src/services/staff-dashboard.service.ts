import type { ApiResponse } from '@/types/api-response.type'
import type { PostStatus } from '@/services/inventory.service'
import { auth } from '@/lib/firebase'
import { privateClient } from '@/lib/api-client'

// ── API 1: /api/staff/dashboard/chat-analys ───────────────────────────────
// Headers: x-auth-id (staffId), x-org-id (orgId — auto-injected by interceptor)

interface ChatAnalyticsResponse {
  activeChats: number
  queueWaiting: number
}

// ── API 2: /api/orgs/{orgId}/staff/dashboard/stats ────────────────────────

interface ItemStatsResponse {
  myItemsInStorage: number
  myItemsTotal: number
  pendingReturns: number
  returnedThisWeek: number
}

// ── API 3: /api/orgs/{orgId}/staff/dashboard/post-stats ───────────────────

export interface PostStatsResponse {
  lostPosts: number
  foundPosts: number
  total: number
  thisMonth: { lost: number; found: number }
}

// ── API 4: /api/core/orgs/{orgId}/inventory ───────────────────────────────

export interface DashboardInventoryItem {
  id: string
  postTitle: string
  category: string
  subcategoryName: string
  status: 'InStorage' | 'Active' | 'ReturnScheduled' | 'Returned' | 'Archived' | 'Expired'
  internalLocation: string
  imageUrl: string | null
  createdAt: string
}

interface RecentItemsResponse {
  items: Array<DashboardInventoryItem>
  totalCount: number
}

// ── API 5: /api/core/orgs/{orgId}/return-rate ─────────────────────────────

export interface StatusCount {
  status: PostStatus
  count: number
  /** 0–100 */
  pct: number
}

export interface PostTypeStats {
  total: number
  statuses: Array<StatusCount>
}

export interface PostStatusBreakdown {
  org: { lost: PostTypeStats; found: PostTypeStats }
  mine: { lost: PostTypeStats; found: PostTypeStats }
}

export interface ReturnRateBreakdown {
  returned: number
  inStorage: number
  expired: number
  other: number
  total: number
  /** Percentage of total that were successfully returned (0–100). */
  returnRate: number
}

export const staffDashboardService = {
  async getChatAnalytics(orgId: string): Promise<ChatAnalyticsResponse> {
    const staffId = auth.currentUser?.uid
    if (!staffId) throw new Error('Not authenticated')
    const { data } = await privateClient.get<ApiResponse<ChatAnalyticsResponse>>(
      '/api/chat/staff/dashboard/chat-analys',
      { headers: { 'x-auth-id': staffId, 'x-org-id': orgId } }
    )
    if (!data.success) throw new Error('Failed to fetch chat analytics')
    return data.data
  },

  async getItemStats(orgId: string): Promise<ItemStatsResponse> {
    const { data } = await privateClient.get<ApiResponse<ItemStatsResponse>>(
      `/api/core/orgs/${orgId}/staff/dashboard/stats`
    )
    if (!data.success) throw new Error('Failed to fetch item stats')
    return data.data
  },

  async getPostStats(orgId: string): Promise<PostStatsResponse> {
    const { data } = await privateClient.get<ApiResponse<PostStatsResponse>>(
      `/api/core/orgs/${orgId}/staff/dashboard/post-stats`
    )
    if (!data.success) throw new Error('Failed to fetch post stats')
    return data.data
  },

  async getRecentItems(orgId: string, page = 1, pageSize = 3): Promise<RecentItemsResponse> {
    const { data } = await privateClient.get<ApiResponse<{ items: Array<DashboardInventoryItem> }>>(
      `/api/core/orgs/${orgId}/inventory`,
      { params: { staffId: 'me', page, pageSize: pageSize + 1, orderBy: 'createdAt', orderDir: 'desc' } }
    )
    if (!data.success) throw new Error('Failed to fetch recent items')
    const all = data.data.items
    const hasMore = all.length > pageSize
    return {
      items: all.slice(0, pageSize),
      totalCount: hasMore
        ? page * pageSize + 1
        : (page - 1) * pageSize + all.length,
    }
  },

  async getOrgReturnRate(orgId: string): Promise<ReturnRateBreakdown> {
    const { data } = await privateClient.get<ApiResponse<ReturnRateBreakdown>>(
      `/api/core/orgs/${orgId}/return-rate`
    )
    if (!data.success) throw new Error('Failed to fetch org return rate')
    return data.data
  },

  async getMyReturnRate(orgId: string): Promise<ReturnRateBreakdown> {
    const { data } = await privateClient.get<ApiResponse<ReturnRateBreakdown>>(
      `/api/core/orgs/${orgId}/staff/dashboard/return-rate`
    )
    if (!data.success) throw new Error('Failed to fetch staff return rate')
    return data.data
  },

  async getPostStatusBreakdown(orgId: string): Promise<PostStatusBreakdown> {
    const { data } = await privateClient.get<ApiResponse<PostStatusBreakdown>>(
      `/api/core/orgs/${orgId}/staff/dashboard/post-status-breakdown`
    )
    if (!data.success) throw new Error('Failed to fetch post status breakdown')
    return data.data
  },

  async getEngagement(orgId: string): Promise<EngagementMetrics> {
    const { data } = await privateClient.get<ApiResponse<EngagementMetrics>>(
      `/api/core/orgs/${orgId}/staff/dashboard/engagement`
    )
    if (!data.success) throw new Error('Failed to fetch engagement metrics')
    return data.data
  },
}

// ── Engagement ─────────────────────────────────────────────────────────────

export type EngagementRank = 'Needs Improvement' | 'Active' | 'Top Performer'

export interface EngagementMetrics {
  score: number
  rank: EngagementRank
  itemsThisMonth: number
  avgItemsPerDay: number
  /** 7 booleans for Mon–Sun of the current week (true = had activity). */
  weekActivity: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
  streak: number
}
