import type { ApiResponse } from '@/types/api-response.type';
import type { PagedResponse } from '@/types/pagination.type';
import { privateClient } from '@/lib/api-client';
import { mockPostMonthly } from '@/mock/data/mock-super-admin-dashboard';

export type OrgStatus = 'Active' | 'Suspended';

export interface SuperAdminOrg {
  id: string;
  name: string;
  logoUrl?: string | null;
  adminEmail?: string | null;
  subscriptionPlan: string;
  status: OrgStatus;
  capacity: { current: number; limit: number | null };
  performance: number;
  successRate: number;
  nextBilling: string | null;
  createdAt: string;
}

export interface OrgListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type OrgListResponse = PagedResponse<SuperAdminOrg> & { totalPages: number };

export interface KpiMetric {
  value: number;
  changePercent: number;
  thisMonth: number;
  sparkline: Array<number>;
}

export interface SuccessReturnRateMetric {
  value: number;
  changePercent: number;
  returned: number;
  total: number;
}

export interface RevenueMetric {
  value: number;
  changePercent: number;
  vsLastMonth: number;
  sparkline: Array<number>;
}

export interface DashboardKpi {
  period: string;
  generatedAt: string;
  totalLostItems: KpiMetric;
  totalFound: KpiMetric;
  successReturnRate: SuccessReturnRateMetric;
  revenueThisMonth: RevenueMetric;
}

export interface RecentActivityItem {
  postId: string;
  title: string;
  authorName: string;
  initials: string;
  location: string;
  status: string;
  createdAt: string;
  timeAgo: string;
}

export interface PostMonthlyItem {
  month: string;
  year: number;
  lost: number;
  found: number;
}

export interface RevenueMonthlyItem {
  month: string;
  year: number;
  org: number;
  user: number;
}

export const superAdminService = {
  async getDashboardKpi(): Promise<DashboardKpi> {
    const { data } = await privateClient.get<ApiResponse<DashboardKpi>>(
      '/api/core/super-admin/dashboard/kpi',
    );
    if (!data.success) throw new Error('Failed to fetch dashboard KPI');
    return data.data;
  },

  async getPostMonthly(months = 12): Promise<Array<PostMonthlyItem>> {
    try {
      const { data } = await privateClient.get<ApiResponse<Array<PostMonthlyItem>>>(
        '/api/core/super-admin/dashboard/post-monthly',
        { params: { months } },
      );
      if (!data.success) throw new Error('Failed to fetch post monthly trend');
      return data.data;
    } catch {
      return mockPostMonthly.data
    }
  },

  async getRevenueMonthly(months = 12): Promise<Array<RevenueMonthlyItem>> {
    const { data } = await privateClient.get<ApiResponse<Array<RevenueMonthlyItem>>>(
      '/api/core/admin/dashboard/revenue-monthly',
      { params: { months } },
    );
    if (!data.success) throw new Error('Failed to fetch revenue monthly trend');
    return data.data;
  },

  async getOrganizations(params?: OrgListParams): Promise<OrgListResponse> {
    const { data } = await privateClient.get<ApiResponse<OrgListResponse>>(
      '/api/core/super-admin/organizations',
      { params },
    );
    if (!data.success) throw new Error('Failed to fetch organizations');
    return data.data;
  },

  async getRecentActivity(params?: { status?: string; page?: number; pageSize?: number }): Promise<{ data: Array<RecentActivityItem>; total: number }> {
    const { data } = await privateClient.get<ApiResponse<{ items: Array<RecentActivityItem>; total: number }>>(
      '/api/core/super-admin/dashboard/recent-activity',
      { params }
    );
    if (!data.success) throw new Error('Failed to fetch recent activity');
    return { data: data.data.items, total: data.data.total };
  },
};
