import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { PagedResponse } from '@/types/pagination.type';
import type { DashboardStats, ActivityLog } from '@/types/analytics.types';
import { mockDashboardStats, getMockActivityLogs } from '@/lib/mock-data';

const USE_MOCK_DATA = true; // Set to false to use real API

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDashboardStats;
    }

    const { data } = await privateClient.get<ApiResponse<DashboardStats>>('/api/admin/analytics/dashboard');
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch dashboard stats');
    return data.data;
  },

  async getActivityLogs(page: number = 1, pageSize: number = 10): Promise<PagedResponse<ActivityLog>> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return getMockActivityLogs(page, pageSize);
    }

    const { data } = await privateClient.get<ApiResponse<PagedResponse<ActivityLog>>>(
      '/api/admin/analytics/activity-logs',
      { params: { page, pageSize } }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch activity logs');
    return data.data;
  },
};
