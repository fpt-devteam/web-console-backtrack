import type { ApiResponse } from '@/types/api-response.type';
import { privateClient } from '@/lib/api-client';

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

export const superAdminService = {
  async getDashboardKpi(): Promise<DashboardKpi> {
    const { data } = await privateClient.get<ApiResponse<DashboardKpi>>(
      '/api/core/super-admin/dashboard/kpi',
    );
    if (!data.success) throw new Error('Failed to fetch dashboard KPI');
    return data.data;
  },

  async getPostMonthly(): Promise<Array<PostMonthlyItem>> {
    const { data } = await privateClient.get<ApiResponse<Array<PostMonthlyItem>>>(
      '/api/core/super-admin/dashboard/post-monthly',
    );
    if (!data.success) throw new Error('Failed to fetch post monthly trend');
    return data.data;
  },

  async getRecentActivity(params?: { status?: string; limit?: number }): Promise<Array<RecentActivityItem>> {
    const { data } = await privateClient.get<ApiResponse<{ data: Array<RecentActivityItem>; total: number }>>(
      '/api/core/super-admin/dashboard/recent-activity',
      { params }
    );
    if (!data.success) throw new Error('Failed to fetch recent activity');
    return data.data.data;
  },
};
