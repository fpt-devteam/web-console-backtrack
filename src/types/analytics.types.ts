export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  growthRate: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details?: string;
}
