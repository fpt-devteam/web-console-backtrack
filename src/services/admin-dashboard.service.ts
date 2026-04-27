import type { ApiResponse } from '@/types/api-response.type'
import type {
  AdminDashboardStats,
  AdminInventoryItem,
  CategoryBreakdownItem,
  MonthlyActivityPoint,
  OrgReturnRateBreakdown,
  StaffPerformanceItem,
} from '@/mock/data/mock-admin-dashboard'
import { privateClient } from '@/lib/api-client'
import {
  mockCategoryBreakdown,
  mockMonthlyActivity,
  mockOrgReturnRate,
  mockRecentInventory,
  mockStaffPerformance,
} from '@/mock/data/mock-admin-dashboard'

export type { AdminDashboardStats, MonthlyActivityPoint, StaffPerformanceItem, CategoryBreakdownItem, OrgReturnRateBreakdown, AdminInventoryItem }

interface RecentInventoryResponse {
  items: Array<AdminInventoryItem>
  totalCount: number
}

export const adminDashboardService = {
  async getStats(orgId: string): Promise<AdminDashboardStats> {
    const { data } = await privateClient.get<ApiResponse<AdminDashboardStats>>(
      `/api/core/admin/orgs/${orgId}/dashboard/stats`
    )
    if (!data.success) throw new Error('Failed to fetch admin dashboard stats')
    return data.data
  },

  async getMonthlyActivity(orgId: string): Promise<Array<MonthlyActivityPoint>> {
    try {
      const { data } = await privateClient.get<ApiResponse<Array<MonthlyActivityPoint>>>(
        `/api/core/admin/orgs/${orgId}/dashboard/monthly-activity`
      )
      if (!data.success) throw new Error('Failed to fetch monthly activity')
      return data.data
    } catch {
      return mockMonthlyActivity.data
    }
  },

  async getStaffPerformance(orgId: string): Promise<Array<StaffPerformanceItem>> {
    try {
      const { data } = await privateClient.get<ApiResponse<Array<StaffPerformanceItem>>>(
        `/api/core/admin/orgs/${orgId}/dashboard/staff-performance`
      )
      if (!data.success) throw new Error('Failed to fetch staff performance')
      return data.data
    } catch {
      return mockStaffPerformance.data
    }
  },

  async getCategoryBreakdown(orgId: string): Promise<Array<CategoryBreakdownItem>> {
    try {
      const { data } = await privateClient.get<ApiResponse<Array<CategoryBreakdownItem>>>(
        `/api/core/admin/orgs/${orgId}/dashboard/category-breakdown`
      )
      if (!data.success) throw new Error('Failed to fetch category breakdown')
      return data.data
    } catch {
      return mockCategoryBreakdown.data
    }
  },

  async getOrgReturnRate(orgId: string): Promise<OrgReturnRateBreakdown> {
    try {
      const { data } = await privateClient.get<ApiResponse<OrgReturnRateBreakdown>>(
        `/api/core/admin/orgs/${orgId}/dashboard/return-rate`
      )
      if (!data.success) throw new Error('Failed to fetch org return rate')
      return data.data
    } catch {
      return mockOrgReturnRate.data
    }
  },

  async getRecentInventory(orgId: string, page = 1, pageSize = 3): Promise<RecentInventoryResponse> {
    try {
      const { data } = await privateClient.get<ApiResponse<{ items: Array<AdminInventoryItem> }>>(
        `/api/core/orgs/${orgId}/inventory`,
        { params: { page, pageSize: pageSize + 1, orderBy: 'createdAt', orderDir: 'desc' } }
      )
      if (!data.success) throw new Error('Failed to fetch recent inventory')
      const all = data.data.items
      const hasMore = all.length > pageSize
      return {
        items: all.slice(0, pageSize),
        totalCount: hasMore
          ? page * pageSize + 1
          : (page - 1) * pageSize + all.length,
      }
    } catch {
      return mockRecentInventory.data
    }
  },
}
