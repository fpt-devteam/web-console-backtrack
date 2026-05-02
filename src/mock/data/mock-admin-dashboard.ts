/**
 * Mock JSON API responses for the Admin Dashboard.
 *
 * Represents the shape of data that would be returned by:
 *   GET /api/admin/orgs/{orgId}/dashboard/stats
 *   GET /api/admin/orgs/{orgId}/dashboard/monthly-activity
 *   GET /api/admin/orgs/{orgId}/dashboard/staff-performance
 *   GET /api/admin/orgs/{orgId}/dashboard/category-breakdown
 *   GET /api/core/orgs/{orgId}/return-rate
 *   GET /api/core/orgs/{orgId}/inventory
 */

// ── Response envelope ──────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data: T
}

// ── Dashboard stats ────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  totalStaff: number
  activeStaff: number
  newStaffThisMonth: number
  totalItems: number
  inStorage: number
  returnedThisMonth: number
  expiredItems: number
  returnRate: number
  foundToday: number
  lostPosts: number
  foundPosts: number
}

/** GET /api/admin/orgs/{orgId}/dashboard/stats */
export const mockAdminDashboardStats: ApiSuccess<AdminDashboardStats> = {
  success: true,
  data: {
    totalStaff: 24,
    activeStaff: 18,
    newStaffThisMonth: 2,
    totalItems: 142,
    inStorage: 68,
    returnedThisMonth: 34,
    expiredItems: 7,
    returnRate: 85,
    foundToday: 6,
    lostPosts: 38,
    foundPosts: 104,
  },
}

// ── Monthly activity (chart) ───────────────────────────────────────────────

export interface MonthlyActivityPoint {
  month: string
  lost: number
  found: number
  returned: number
}

/** GET /api/admin/orgs/{orgId}/dashboard/monthly-activity */
export const mockMonthlyActivity: ApiSuccess<Array<MonthlyActivityPoint>> = {
  success: true,
  data: [
    { month: 'May', lost:  8, found: 20, returned: 22 },
    { month: 'Jun', lost: 10, found: 24, returned: 28 },
    { month: 'Jul', lost: 12, found: 26, returned: 32 },
    { month: 'Aug', lost: 14, found: 28, returned: 36 },
    { month: 'Sep', lost: 11, found: 25, returned: 30 },
    { month: 'Oct', lost: 13, found: 32, returned: 40 },
    { month: 'Nov', lost: 16, found: 36, returned: 46 },
    { month: 'Dec', lost: 15, found: 33, returned: 43 },
    { month: 'Jan', lost: 17, found: 38, returned: 50 },
    { month: 'Feb', lost: 15, found: 35, returned: 44 },
    { month: 'Mar', lost: 19, found: 41, returned: 55 },
    { month: 'Apr', lost: 21, found: 44, returned: 58 },
  ],
}

// ── Staff performance ──────────────────────────────────────────────────────

export interface StaffPerformanceItem {
  id: string
  name: string
  role: string
  itemsLogged: number
  returnRate: number
  activeChats: number
  streak: number
}

/** GET /api/admin/orgs/{orgId}/dashboard/staff-performance */
export const mockStaffPerformance: ApiSuccess<Array<StaffPerformanceItem>> = {
  success: true,
  data: [
    { id: 'staff-001', name: 'Nguyen Van A',  role: 'Staff',  itemsLogged: 31, returnRate: 90, activeChats: 3, streak: 14 },
    { id: 'staff-002', name: 'Tran Thi B',   role: 'Staff',  itemsLogged: 27, returnRate: 85, activeChats: 2, streak: 10 },
    { id: 'staff-003', name: 'Le Van C',      role: 'Staff',  itemsLogged: 22, returnRate: 77, activeChats: 1, streak: 6  },
    { id: 'staff-004', name: 'Pham Thi D',   role: 'Staff',  itemsLogged: 18, returnRate: 72, activeChats: 4, streak: 3  },
    { id: 'staff-005', name: 'Hoang Van E',  role: 'Staff',  itemsLogged: 12, returnRate: 58, activeChats: 0, streak: 0  },
  ],
}

// ── Category breakdown ─────────────────────────────────────────────────────

export interface CategoryBreakdownItem {
  category: string
  count: number
  color: string
}

/** GET /api/admin/orgs/{orgId}/dashboard/category-breakdown */
export const mockCategoryBreakdown: ApiSuccess<Array<CategoryBreakdownItem>> = {
  success: true,
  data: [
    { category: 'Electronics',        count: 42, color: '#ff385c' },
    { category: 'Personal Belongings', count: 35, color: '#2471A3' },
    { category: 'Bags',               count: 28, color: '#06c167' },
    { category: 'Cards & Documents',  count: 21, color: '#c97a00' },
    { category: 'Accessories',        count: 16, color: '#9B59B6' },
  ],
}

// ── Org-wide return rate ───────────────────────────────────────────────────

export interface OrgReturnRateBreakdown {
  returned: number
  inStorage: number
  expired: number
  other: number
  total: number
  returnRate: number
}

/** GET /api/core/orgs/{orgId}/return-rate */
export const mockOrgReturnRate: ApiSuccess<OrgReturnRateBreakdown> = {
  success: true,
  data: {
    returned: 121,
    inStorage: 68,
    expired: 7,
    other: 4,
    total: 200,
    returnRate: 60.5,
  },
}

// ── Recent inventory items ─────────────────────────────────────────────────

export type ItemStatus = 'InStorage' | 'Active' | 'ReturnScheduled' | 'Returned' | 'Archived' | 'Expired'

export interface AdminInventoryItem {
  id: string
  postTitle: string
  category: string
  subcategoryName: string
  status: ItemStatus
  organizationStorageLocation: string
  imageUrl: string | null
  staffName: string
  createdAt: string
}

/**
 * GET /api/core/orgs/{orgId}/inventory
 *   ?page=1&pageSize=8&orderBy=createdAt&orderDir=desc
 */
export const mockRecentInventory: ApiSuccess<{ items: Array<AdminInventoryItem>; totalCount: number }> = {
  success: true,
  data: {
    totalCount: 142,
    items: [
      {
        id: 'item-001', postTitle: 'Blue Backpack with laptop inside', category: 'Bags',
        subcategoryName: 'Backpack', status: 'InStorage', organizationStorageLocation: 'Shelf A-03',
        imageUrl: null, staffName: 'Nguyen Van A', createdAt: '2026-04-27T09:14:00Z',
      },
      {
        id: 'item-002', postTitle: 'iPhone 14 Pro – black', category: 'Electronics',
        subcategoryName: 'Phone', status: 'ReturnScheduled', organizationStorageLocation: 'Shelf B-01',
        imageUrl: null, staffName: 'Tran Thi B', createdAt: '2026-04-26T14:32:00Z',
      },
      {
        id: 'item-003', postTitle: 'Leather wallet (brown)', category: 'Personal Belongings',
        subcategoryName: 'Wallet', status: 'InStorage', organizationStorageLocation: 'Drawer D-02',
        imageUrl: null, staffName: 'Le Van C', createdAt: '2026-04-26T11:05:00Z',
      },
      {
        id: 'item-004', postTitle: 'Student ID – Nguyen Van A', category: 'Cards & Documents',
        subcategoryName: 'Student ID', status: 'Returned', organizationStorageLocation: 'Shelf A-01',
        imageUrl: null, staffName: 'Nguyen Van A', createdAt: '2026-04-25T16:20:00Z',
      },
      {
        id: 'item-005', postTitle: 'AirPods Pro (2nd gen) with case', category: 'Electronics',
        subcategoryName: 'Earphones', status: 'InStorage', organizationStorageLocation: 'Shelf B-02',
        imageUrl: null, staffName: 'Tran Thi B', createdAt: '2026-04-25T10:45:00Z',
      },
      {
        id: 'item-006', postTitle: 'Black umbrella', category: 'Accessories',
        subcategoryName: 'Umbrella', status: 'Active', organizationStorageLocation: 'Shelf C-01',
        imageUrl: null, staffName: 'Le Van C', createdAt: '2026-04-24T08:30:00Z',
      },
      {
        id: 'item-007', postTitle: 'MacBook Pro 14" silver', category: 'Electronics',
        subcategoryName: 'Laptop', status: 'InStorage', organizationStorageLocation: 'Cabinet E-01',
        imageUrl: null, staffName: 'Pham Thi D', createdAt: '2026-04-24T07:15:00Z',
      },
      {
        id: 'item-008', postTitle: 'Ray-Ban sunglasses', category: 'Accessories',
        subcategoryName: 'Sunglasses', status: 'Expired', organizationStorageLocation: 'Shelf A-05',
        imageUrl: null, staffName: 'Hoang Van E', createdAt: '2026-04-23T14:00:00Z',
      },
    ],
  },
}
