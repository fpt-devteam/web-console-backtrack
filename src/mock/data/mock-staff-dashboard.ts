import type { PostStatusBreakdown, ReturnRateBreakdown } from '@/services/staff-dashboard.service'

/**
 * Mock JSON API responses for the Staff Dashboard.
 *
 * Represents the shape of data that would be returned by:
 *   GET /api/staff/me/dashboard/stats
 *   GET /api/staff/me/dashboard/weekly-activity
 *   GET /api/core/orgs/{orgId}/inventory  (recent items slice)
 *   GET /api/staff/me/dashboard/return-rate
 *   GET /api/core/orgs/{orgId}/return-rate
 *   GET /api/staff/me/posts/stats
 *   GET /api/staff/me/dashboard/engagement
 */

// ── Response envelope ──────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data: T
}

// ── Dashboard stats ────────────────────────────────────────────────────────

export interface StaffDashboardStats {
  myItemsInStorage: number
  myItemsTotal: number
  pendingReturns: number
  activeChats: number
  queueWaiting: number
  returnedThisWeek: number
}

/** GET /api/staff/dashboard/stats */
export const mockStaffDashboardStats: ApiSuccess<StaffDashboardStats> = {
  success: true,
  data: {
    myItemsInStorage: 8,
    myItemsTotal: 31,
    pendingReturns: 5,
    activeChats: 3,
    queueWaiting: 7,
    returnedThisWeek: 12,
  },
}

// ── Weekly activity (chart) ────────────────────────────────────────────────

export interface WeeklyActivityPoint {
  date: string
  label: string
  intake: number
  returned: number
}

/** GET /api/staff/me/dashboard/weekly-activity */
export const mockWeeklyActivity: ApiSuccess<Array<WeeklyActivityPoint>> = {
  success: true,
  data: [
    { date: '2026-04-21', label: 'Mon', intake: 2, returned: 1 },
    { date: '2026-04-22', label: 'Tue', intake: 3, returned: 2 },
    { date: '2026-04-23', label: 'Wed', intake: 1, returned: 3 },
    { date: '2026-04-24', label: 'Thu', intake: 4, returned: 2 },
    { date: '2026-04-25', label: 'Fri', intake: 2, returned: 1 },
    { date: '2026-04-26', label: 'Sat', intake: 5, returned: 3 },
    { date: '2026-04-27', label: 'Sun', intake: 3, returned: 0 },
  ],
}

// ── Recent items I logged ──────────────────────────────────────────────────

export interface DashboardInventoryItem {
  id: string
  postTitle: string
  category: string
  subcategoryName: string
  status: 'InStorage' | 'Active' | 'ReturnScheduled' | 'Returned' | 'Archived' | 'Expired'
  organizationStorageLocation: string
  imageUrl: string | null
  createdAt: string
}

/**
 * GET /api/core/orgs/{orgId}/inventory
 *   ?staffId=me&pageSize=5&page=1&orderBy=createdAt&orderDir=desc
 */
export const mockRecentItems: ApiSuccess<{ items: Array<DashboardInventoryItem>; totalCount: number }> = {
  success: true,
  data: {
    totalCount: 31,
    items: [
      {
        id: 'item-001',
        postTitle: 'Blue Backpack with laptop inside',
        category: 'PersonalBelongings',
        subcategoryName: 'Backpack',
        status: 'InStorage',
        organizationStorageLocation: 'Shelf A-03',
        imageUrl: null,
        createdAt: '2026-04-27T09:14:00Z',
      },
      {
        id: 'item-002',
        postTitle: 'iPhone 14 Pro – black',
        category: 'Electronics',
        subcategoryName: 'Phone',
        status: 'ReturnScheduled',
        organizationStorageLocation: 'Shelf B-01',
        imageUrl: null,
        createdAt: '2026-04-26T14:32:00Z',
      },
      {
        id: 'item-003',
        postTitle: 'Leather wallet (brown)',
        category: 'PersonalBelongings',
        subcategoryName: 'Wallet',
        status: 'InStorage',
        organizationStorageLocation: 'Drawer D-02',
        imageUrl: null,
        createdAt: '2026-04-26T11:05:00Z',
      },
      {
        id: 'item-004',
        postTitle: 'Student ID – Nguyen Van A',
        category: 'Cards',
        subcategoryName: 'Student ID',
        status: 'Returned',
        organizationStorageLocation: 'Shelf A-01',
        imageUrl: null,
        createdAt: '2026-04-25T16:20:00Z',
      },
      {
        id: 'item-005',
        postTitle: 'AirPods Pro (2nd gen) with case',
        category: 'Electronics',
        subcategoryName: 'Earphones',
        status: 'InStorage',
        organizationStorageLocation: 'Shelf B-02',
        imageUrl: null,
        createdAt: '2026-04-25T10:45:00Z',
      },
    ],
  },
}

// ── Return rate — personal (this staff member) ─────────────────────────────

/** GET /api/staff/me/dashboard/return-rate */
export const mockMyReturnRate: ApiSuccess<ReturnRateBreakdown> = {
  success: true,
  data: {
    returned: 18,
    inStorage: 8,
    expired: 3,
    other: 2,
    total: 31,
    returnRate: 58.1,
  },
}

// ── Post stats (Lost / Found posts in the public system) ──────────────────

export interface PostStats {
  lostPosts: number
  foundPosts: number
  total: number
  thisMonth: { lost: number; found: number }
}

/** GET /api/staff/me/posts/stats */
export const mockPostStats: ApiSuccess<PostStats> = {
  success: true,
  data: {
    lostPosts: 14,
    foundPosts: 23,
    total: 37,
    thisMonth: { lost: 5, found: 8 },
  },
}

// ── Post status breakdown ──────────────────────────────────────────────────

/** GET /api/core/orgs/{orgId}/staff/dashboard/post-status-breakdown */
export const mockPostStatusBreakdown: ApiSuccess<PostStatusBreakdown> = {
  success: true,
  data: {
    org: {
      lost: {
        total: 200,
        statuses: [
          { status: 'InStorage',       count: 6,   pct: 3  },
          { status: 'ReturnScheduled', count: 16,  pct: 8  },
          { status: 'Returned',        count: 100, pct: 50 },
          { status: 'Archived',        count: 16,  pct: 8  },
          { status: 'Expired',         count: 12,  pct: 6  },
        ],
      },
      found: {
        total: 300,
        statuses: [
          { status: 'InStorage',       count: 99,  pct: 33 },
          { status: 'ReturnScheduled', count: 33,  pct: 11 },
          { status: 'Returned',        count: 117, pct: 39 },
          { status: 'Archived',        count: 18,  pct: 6  },
          { status: 'Expired',         count: 9,   pct: 3  },
        ],
      },
    },
    mine: {
      lost: {
        total: 14,
        statuses: [
          { status: 'InStorage',       count: 0, pct: 0  },
          { status: 'ReturnScheduled', count: 1, pct: 7  },
          { status: 'Returned',        count: 7, pct: 50 },
          { status: 'Archived',        count: 1, pct: 7  },
          { status: 'Expired',         count: 1, pct: 7  },
        ],
      },
      found: {
        total: 23,
        statuses: [
          { status: 'InStorage',       count: 8, pct: 35 },
          { status: 'ReturnScheduled', count: 4, pct: 17 },
          { status: 'Returned',        count: 8, pct: 35 },
          { status: 'Archived',        count: 1, pct: 4  },
          { status: 'Expired',         count: 0, pct: 0  },
        ],
      },
    },
  },
}

// ── Engagement metrics ─────────────────────────────────────────────────────

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

/** GET /api/staff/me/dashboard/engagement */
export const mockEngagement: ApiSuccess<EngagementMetrics> = {
  success: true,
  data: {
    score: 82,
    rank: 'Active',
    itemsThisMonth: 23,
    avgItemsPerDay: 1.2,
    weekActivity: [true, true, false, true, true, true, false],
    streak: 12,
  },
}
