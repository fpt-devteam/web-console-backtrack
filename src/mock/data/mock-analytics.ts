import type { DashboardStats, ActivityLog } from '@/types/analytics.types';
import type { PagedResponse } from '@/types/pagination.type';

export const mockDashboardStats: DashboardStats = {
  totalUsers: 12543,
  activeUsers: 8934,
  totalRevenue: 456789.50,
  growthRate: 23.5,
};

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: 'user-001',
    userName: 'John Doe',
    action: 'User Login',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    details: 'Logged in from Chrome on Windows',
  },
  {
    id: '2',
    userId: 'user-002',
    userName: 'Jane Smith',
    action: 'Created Report',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    details: 'Monthly sales report generated',
  },
  {
    id: '3',
    userId: 'user-003',
    userName: 'Bob Johnson',
    action: 'Updated Settings',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    details: 'Changed notification preferences',
  },
  {
    id: '4',
    userId: 'user-004',
    userName: 'Alice Williams',
    action: 'Deleted User',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    details: 'Removed inactive user account',
  },
  {
    id: '5',
    userId: 'user-005',
    userName: 'Charlie Brown',
    action: 'Exported Data',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    details: 'Exported user data to CSV',
  },
];

export function getMockActivityLogs(page: number = 1, pageSize: number = 10): PagedResponse<ActivityLog> {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = mockActivityLogs.slice(startIndex, endIndex);

  return {
    items,
    page,
    pageSize,
    totalCount: mockActivityLogs.length,
  };
}

